<script setup lang="ts">
definePageMeta({
  layout: "secondlayernohead",
  middleware: "auth",
});

const { $debounce } = useNuxtApp();
const dayjs = useDayjs();
const route = useRoute();
const accountIdRoute = route.query.accountId;
let accountId = 0;
if (typeof accountIdRoute === "string") {
  accountId = parseInt(accountIdRoute);
}
const page = ref(1);
const days = ref<DailyRec[]>([]);
const dialog = ref(false);

const { getAccount } = useAccountStore();
const { account } = storeToRefs(useAccountStore());
const { getAccountRecordHistory } = useRecordStore();
const { transactionLog } = storeToRefs(useRecordStore());

const generateLogs = () => {
  let tmp_date =
    days.value.length > 0
      ? dayjs(days.value[days.value.length - 1].text).format("YYYY-MM-DD")
      : "";
  for (let i = 0; i < transactionLog.value.length; i++) {
    const row = transactionLog.value[i];
    const the_date = dayjs(row.tDate).format("YYYY-MM-DD");
    let dailyR: DailyRec = {
      id: "",
      text: "",
      logs: [],
      totalIn: 0,
      totalOut: 0,
    };

    if (tmp_date === "") {
      dailyR = {
        id: the_date,
        text: the_date,
        logs: [row],
        totalIn: row.amountIn,
        totalOut: row.amountOut,
      };
      days.value.push(dailyR);
    } else if (tmp_date === the_date) {
      const rowindex = days.value.findIndex((obj) => obj.id === the_date);
      days.value[rowindex].logs.push(row);
      days.value[rowindex].totalIn += row.amountIn;
      days.value[rowindex].totalOut += row.amountOut;
    } else if (tmp_date !== the_date) {
      dailyR = {
        id: the_date,
        text: the_date,
        logs: [row],
        totalIn: row.amountIn,
        totalOut: row.amountOut,
      };
      days.value.push(dailyR);
    }

    tmp_date = dayjs(row.tDate).format("YYYY-MM-DD");
  }
};

const refreshParent = async () => {
  days.value = [];
  page.value = 1;
  await getAccount(accountId);
  await getAccountRecordHistory({ accountId: accountId, page: page.value });
  generateLogs();
};

const onScroll = $debounce(
  async () => {
    const ih = window.innerHeight;
    const ls = document.getElementById("loader-skeleton");
    let rect = {
      height: 0,
      y: 0,
    };

    if (ls) {
      rect = ls.getBoundingClientRect();
    }

    const posy = rect.height + rect.y;

    if (posy > ih) {
      return;
    }

    if (posy <= ih) {
      page.value += 1;
      await getAccountRecordHistory({ accountId: accountId, page: page.value });
      generateLogs();
    }
  },
  1000,
  { leading: false, trailing: true },
);

onMounted(() => {
  generateLogs();
  document.addEventListener("scroll", onScroll);
});

onBeforeUnmount(() => {
  document.removeEventListener("scroll", onScroll);
});

await getAccount(accountId);
await getAccountRecordHistory({ accountId: accountId, page: page.value });
</script>
<template>
  <v-app-bar extended class="border-b">
    <v-btn icon="i-mdi-arrow-left" @click="$router.back()" />
    <v-app-bar-title>{{ account?.title }}</v-app-bar-title>
    <v-btn icon="i-mdi-add" @click="dialog = true" />
    <template v-slot:extension>
      <div class="w-100 text-center">
        Saldo: {{ toMoney(account ? account.eBalance : 0) }}
      </div>
    </template>
  </v-app-bar>
  <v-container fluid class="fill-height">
    <!-- <v-skeleton-loader type="list-item-two-line" width="100%"></v-skeleton-loader> -->
    <v-row no-gutters>
      <v-col v-for="(row, i) in days" cols="12">
        <v-card variant="plain" class="mt-1" :id="row.id">
          <v-card-text>
            <v-row no-gutters>
              <v-col cols="10" class="font-weight-bold">
                {{ row.text }}
              </v-col>
              <v-col cols="2" class="text-right" />
              <template v-for="log in row.logs">
                <v-col cols="8" class="mt-4">
                  {{ log.title }}
                </v-col>
                <v-col
                  cols="4"
                  :class="`mt-4 text-right ${log.tCode === 'C' ? `text-green-darken-3` : `text-red-darken-1`} font-weight-bold`"
                >
                  {{
                    toMoney(
                      log.tCode === "D"
                        ? log.amountOut
                        : log.tCode === "C"
                          ? log.amountIn
                          : 0,
                    )
                  }}
                </v-col>
              </template>
              <template v-if="row.totalIn || row.totalOut">
                <v-col cols="6" class="mt-4 text-center">
                  <v-chip rounded class="text-green-darken-3 font-weight-bold"
                    >Masuk: {{ toMoney(row.totalIn) }}</v-chip
                  >
                </v-col>
                <v-col cols="6" class="mt-4 text-center">
                  <v-chip rounded class="text-red-darken-1 font-weight-bold">
                    Keluar: {{ toMoney(row.totalOut) }}
                  </v-chip>
                </v-col>
              </template>
            </v-row>
          </v-card-text>
        </v-card>
        <v-divider></v-divider>
      </v-col>
    </v-row>
    <v-skeleton-loader
      id="loader-skeleton"
      type="list-item-two-line"
      width="100%"
    ></v-skeleton-loader>
  </v-container>
  <LazyAccountAddRecord
    v-model:dialog="dialog"
    :accountid="accountId"
    @savesuccess="refreshParent()"
  />
</template>
