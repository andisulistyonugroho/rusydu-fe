<script setup lang="ts">
const { callHook, $debounce } = useNuxtApp();
definePageMeta({
  layout: "secondlayer",
  middleware: "auth",
});

const { getTotalBalance } = useAccountStore();
const { getDebt, getPaid } = useDebtStore();
const { debts } = storeToRefs(useDebtStore());

callHook("setHeader", "Hutang");

const unpaid = computed(() =>
  debts.value.reduce((total, obj) => (total += obj.eBalance), 0),
);
const total = computed(() =>
  debts.value.reduce((total, obj) => (total += obj.sBalance), 0),
);
const paid = computed(() => total.value - unpaid.value);

const dialog = ref(false);
const selectedDebtId = ref();
const selectedDebtTitle = ref();
const selectedDebtAmount = ref();
const isActive = ref(true);

const openDialog = $debounce(
  async (data: { id: number; title: string; eBalance: number }) => {
    dialog.value = true;
    selectedDebtId.value = data.id;
    selectedDebtTitle.value = data.title;
    selectedDebtAmount.value = data.eBalance;
  },
  1000,
  { leading: true, trailing: false },
);

const closeIt = () => {
  dialog.value = false;
};

const getLunasDebt = $debounce(
  async () => {
    callHook("waitDialog", true);
    await getPaid();
  },
  1000,
  {
    leading: true,
    trailing: false,
  },
);

const refreshParent = async () => {
  await getDebt();
  getTotalBalance();
};

refreshParent();
</script>
<template>
  <v-list>
    <v-list-item>
      <div class="d-flex justify-space-between mb-5">
        <div>
          <v-btn
            :variant="isActive ? 'flat' : 'tonal'"
            :prepend-icon="
              isActive ? 'i-mdi-radiobox-marked' : 'i-mdi-radiobox-blank'
            "
            class="text-none"
            @click="
              isActive = true;
              refreshParent();
            "
          >
            Belum Lunas
          </v-btn>
        </div>
        <div>
          <v-btn
            :variant="isActive ? 'tonal' : 'flat'"
            :prepend-icon="
              isActive ? 'i-mdi-radiobox-blank' : 'i-mdi-radiobox-marked'
            "
            class="text-none"
            @click="
              isActive = false;
              getLunasDebt();
            "
          >
            Sudah Lunas
          </v-btn>
        </div>
      </div>
      <v-btn block variant="tonal" color="black" class="text-capitalize"
        >hutang: {{ toMoney(total) }}</v-btn
      >
      <v-btn block variant="tonal" color="success" class="text-capitalize mt-2"
        >terbayar: {{ toMoney(paid) }}</v-btn
      >
      <v-btn
        block
        variant="tonal"
        color="red"
        class="font-weight-black text-capitalize my-2"
        >sisa: {{ toMoney(unpaid) }}</v-btn
      >
    </v-list-item>
    <v-divider></v-divider>
    <v-list-item v-for="row in debts" :title="row.title">
      <div class="text-caption">
        Hutang: {{ toMoney(row.sBalance) }}<br />
        Terbayar: {{ toMoney(row.sBalance - row.eBalance) }}<br />
        Sisa: {{ toMoney(row.eBalance) }}
      </div>
      <template v-slot:append>
        <v-menu>
          <template v-slot:activator="{ props }">
            <v-btn
              icon="i-mdi-dots-vertical"
              variant="text"
              v-bind="props"
            ></v-btn>
          </template>

          <v-list density="compact">
            <v-list-item v-if="row.eBalance > 0">
              <v-list-item-title @click="openDialog(row)"
                >Bayar</v-list-item-title
              >
            </v-list-item>
            <v-list-item :to="`/debt/history?id=${row.id}`">
              <v-list-item-title>History</v-list-item-title>
            </v-list-item>
          </v-list>
        </v-menu>
      </template>
    </v-list-item>
  </v-list>
  <v-dialog v-model="dialog" :debtid="selectedDebtId">
    <LazyDebtPayment
      v-if="dialog"
      :debtid="selectedDebtId"
      :debttitle="selectedDebtTitle"
      :debtamount="selectedDebtAmount"
      @closeit="closeIt()"
      @refreshparent="refreshParent()"
    />
  </v-dialog>
</template>
