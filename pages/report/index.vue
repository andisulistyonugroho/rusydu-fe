<script setup lang="ts">
definePageMeta({
  layout: "secondlayernohead",
  middleware: "auth",
});
const { $debounce, $dayjs } = useNuxtApp();
const { generateReport, getStartingBalance } = useRecordStore();
const { finRecord, sBalance } = storeToRefs(useRecordStore());
const { getMyAccounts } = useAccountStore();
const { accounts } = storeToRefs(useAccountStore());

const payload = ref<ReportPayload>({
  startDate: $dayjs().format("YYYY-MM-DD"),
  endDate: $dayjs().format("YYYY-MM-DD"),
  financialAccountId: 0,
});
const dialog = ref(false);
const loading = ref(false);
const saldos = ref<number[]>([]);

const doGetReport = $debounce(
  async () => {
    try {
      loading.value = true;
      const theStartDate = $dayjs(payload.value.startDate)
        .subtract(7, "hour")
        .format("YYYY-MM-DD 17:00:00");
      const theEndDate = $dayjs(payload.value.endDate).format(
        "YYYY-MM-DD 16:59:59",
      );
      await generateReport({
        startDate: theStartDate,
        endDate: theEndDate,
        financialAccountId: payload.value.financialAccountId,
      });
      await getStartingBalance(theStartDate, payload.value.financialAccountId);
      generateSaldos();
      loading.value = false;
      dialog.value = false;
    } catch (error) {
      loading.value = false;
    }
  },
  1000,
  { leading: true, trailing: false },
);

const openPrinter = $debounce(
  () => {
    window.print();
  },
  1000,
  { leading: true, trailing: false },
);
const generateSaldos = () => {
  saldos.value = [];
  let sb = sBalance.value;
  for (let i = 0; i < finRecord.value.length; i++) {
    sb += finRecord.value[i].amountIn - finRecord.value[i].amountOut;
    saldos.value.push(sb);
  }
};

const totalIn = computed(() => {
  return finRecord.value.reduce((amount, obj) => {
    return amount + obj.amountIn;
  }, 0);
});
const totalOut = computed(() => {
  return finRecord.value.reduce((amount, obj) => {
    return amount + obj.amountOut;
  }, 0);
});
const balanceLeft = computed(() => {
  return sBalance.value + totalIn.value - totalOut.value;
});

finRecord.value = [];
await getMyAccounts();
</script>
<template>
  <v-app-bar class="border-b">
    <v-btn icon="i-mdi-arrow-left" @click="$router.back()" />
    <v-app-bar-title>Laporan</v-app-bar-title>
    <v-btn icon="i-mdi-calendar-outline" @click="dialog = true" />
    <v-btn
      v-if="finRecord.length"
      icon="i-mdi-printer-outline"
      @click="openPrinter()"
    />
  </v-app-bar>
  <v-table class="font-monospace">
    <thead>
      <tr>
        <th class="text-left" width="5%">TGL</th>
        <th class="text-left" width="*">URAIAN</th>
        <th class="text-right" width="20%">D</th>
        <th class="text-right" width="20%">C</th>
        <th class="text-right" width="20%">B</th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="(row, index) in finRecord">
        <td>{{ simpleDate(row.tDate) }}</td>
        <td>{{ row.title }}</td>
        <td class="text-right">
          {{ toMoney(row.amountOut) }}
        </td>
        <td class="text-right">
          {{ toMoney(row.amountIn) }}
        </td>
        <td class="text-right">
          {{ toMoney(saldos[index]) }}
        </td>
      </tr>
      <tr>
        <td></td>
        <td>Jumlah</td>
        <td class="text-right">{{ toMoney(totalOut) }}</td>
        <td class="text-right">{{ toMoney(totalIn) }}</td>
      </tr>
    </tbody>
  </v-table>
  <div class="d-flex justify-end font-weight-bold text-body-2 font-monospace">
    <div class="bg-grey-lighten-3 pa-3">
      <div class="d-flex justify-space-between">
        <div class="mr-3">Saldo awal:</div>
        <div class="text-right">{{ toMoney(sBalance) }}</div>
      </div>
      <div class="d-flex justify-space-between">
        <div class="mr-3">Total kredit:</div>
        <div class="text-right">{{ toMoney(totalIn) }}</div>
      </div>
      <div class="d-flex justify-space-between">
        <div class="mr-3">Total debit:</div>
        <div class="text-right">{{ toMoney(totalOut) }}</div>
      </div>
      <div class="d-flex justify-space-between">
        <div class="mr-3">Saldo akhir:</div>
        <div class="text-right">{{ toMoney(balanceLeft) }}</div>
      </div>
    </div>
  </div>

  <v-dialog v-model="dialog" persistent>
    <v-card>
      <v-toolbar class="rounded-t-lg">
        <v-btn icon="i-mdi-close" dark @click="dialog = false" />
        <v-toolbar-title>Filter</v-toolbar-title>
      </v-toolbar>
      <v-container fluid>
        <v-row no-gutters>
          <v-col cols="6" class="pr-1">
            <v-date-input
              v-model="payload.startDate"
              prepend-icon=""
              variant="underlined"
              label="Tanggal Awal*"
            />
          </v-col>
          <v-col cols="6" class="pl-1">
            <v-date-input
              v-model="payload.endDate"
              prepend-icon=""
              variant="underlined"
              label="Tanggal Akhir*"
            />
          </v-col>
          <v-col cols="12">
            <v-select
              v-model="payload.financialAccountId"
              variant="underlined"
              item-value="id"
              label="Akun"
              :items="accounts"
            />
          </v-col>
          <v-col cols="12">
            <v-btn
              block
              variant="tonal"
              :loading="loading"
              @click="doGetReport()"
              >Generate</v-btn
            >
          </v-col>
        </v-row>
      </v-container>
    </v-card>
  </v-dialog>
</template>
