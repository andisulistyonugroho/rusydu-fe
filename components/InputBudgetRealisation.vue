<script setup lang="ts">
import type { MaskInputOptions } from "maska";

const props = defineProps({
  dialog: { type: Boolean, default: false },
  budgettitle: { type: String, default: null },
  budgetid: { type: Number, default: null },
  amount: { type: Number, default: null },
  period: { type: String, default: null },
});
const { $dayjs, $debounce, callHook } = useNuxtApp();
const { getMyAccounts, getTotalBalance } = useAccountStore();
const { payBudget, getBudgetInPeriod } = useBudgetingStore();
const { accounts } = storeToRefs(useAccountStore());
const emit = defineEmits(["closeit"]);
const payload = ref<SpendingBudget>({
  title: "",
  amount: 0,
  tDate: $dayjs().format(),
  fromFinancialAccountId: null,
  monthlyBudgetId: null,
});
const unmaskedamount = ref();
const form = ref();
const loading = ref(false);

watch(props, (o, n) => {
  if (n.dialog) {
    payload.value.title = props.budgettitle;
    payload.value.monthlyBudgetId = props.budgetid;
    payload.value.amount = props.amount;
    unmaskedamount.value = props.amount;
  }
});

const options = reactive<MaskInputOptions>({
  number: { locale: "id" },
  onMaska: (detail) => {
    payload.value.amount = parseFloat(detail.unmasked);
  },
});

const doSubmit = $debounce(
  async () => {
    try {
      const validate = await form.value.validate();
      if (!validate.valid) {
        return;
      }
      loading.value = true;
      await payBudget(payload.value);
      await getBudgetInPeriod(props.period);
      getTotalBalance();
      emit("closeit");
      loading.value = false;
      callHook("snackIt", "Berhasil disimpan");
    } catch (error) {
      loading.value = false;
      callHook("snackIt", error);
    }
  },
  1000,
  { leading: true, trailing: false },
);

await getMyAccounts();
</script>
<template>
  <v-dialog v-model="props.dialog">
    <v-card variant="flat">
      <v-toolbar dark color="primary" flat>
        <v-btn icon="i-mdi-close" dark @click="emit('closeit')" />
        <v-toolbar-title>Realisasi</v-toolbar-title>
      </v-toolbar>
      <v-card-text>
        <v-form ref="form" lazy-validation>
          <v-text-field
            v-model="payload.title"
            label="Title"
            :rules="[(v) => !!v || 'Harus diisi']"
            variant="underlined"
            placeholder="Pembelian bensin"
            persistent-placeholder
            clearable
          />
          <v-text-field
            v-model="unmaskedamount"
            prefix="Rp"
            v-maska="options"
            :rules="[(v) => !!v || 'Harus diisi']"
            label="Nominal"
            variant="underlined"
            clearable
          />
          <v-select
            v-model="payload.fromFinancialAccountId"
            :rules="[(v) => !!v || 'Harus diisi']"
            label="Akun Asal"
            :items="accounts"
            item-value="id"
            variant="underlined"
          />
          <v-date-input
            v-model="payload.tDate"
            prepend-icon=""
            variant="underlined"
            label="Tanggal Transaksi"
          />
        </v-form>
      </v-card-text>
      <v-card-actions>
        <v-btn
          variant="tonal"
          color="error"
          :loading="loading"
          @click="form.reset()"
          >batal</v-btn
        >
        <v-btn
          variant="tonal"
          color="primary"
          :loading="loading"
          @click="doSubmit()"
          >simpan</v-btn
        >
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>
