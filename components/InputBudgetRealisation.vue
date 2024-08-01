<script setup>
const props = defineProps({
  dialog: { type: Boolean, default: false },
  budgettitle: { type: String, default: null },
  budgetid: { type: Number, default: null },
  amount: { type: Number, default: null }
})
const { $dayjs, $debounce, $bus } = useNuxtApp()
const { getMyAccounts, getTotalBalance } = useAccountStore()
const { addRecord } = useRecordStore()
const { accounts } = storeToRefs(useAccountStore())
const emit = defineEmits(['closeit'])
const transactionDate = $dayjs().format('YYYY-MM-DD')
const payload = ref({
  title: null,
  tCode: 'D',
  amount: 0,
  fromFinancialAccountId: null,
  toFinancialAccountId: null,
  tDate: null,
  monthlyBudgetId: null
})
const unmaskedamount = ref()
const form = ref()

watch(props, (o, n) => {
  if (n.dialog) {
    payload.value.title = props.budgettitle
    payload.value.monthlyBudgetId = props.budgetid
    payload.value.amount = props.amount
    payload.value.tDate = transactionDate
    unmaskedamount.value = props.amount
  }
})

const options = {
  number: { locale: 'id' },
  onMaska: (detail) => {
    payload.value.amount = detail.unmasked
  }
}

const doSubmit = $debounce(async () => {
  try {
    const validate = await form.value.validate()
    if (!validate.valid) {
      return
    }
    $bus.$emit('wait-dialog', true)
    await addRecord(payload.value)
    getTotalBalance()
    emit('closeit')
    $bus.$emit('wait-dialog', false)
  } catch (error) {
    $bus.$emit('wait-dialog', false)
    $bus.$emit('eat-snackbar', error)
  }
}, 1000, { leading: true, trailing: false })

await getMyAccounts()

</script>
<template>
  <v-dialog v-model="props.dialog">
    <v-card variant="flat" style="border-radius:0 !important;">
      <v-toolbar dark color="primary" flat>
        <v-btn icon="i-mdi-close" dark @click="emit('closeit')" />
        <v-toolbar-title>Realisasi</v-toolbar-title>
      </v-toolbar>
      <v-card-text>
        <v-form ref="form" lazy-validation>
          <v-text-field v-model="payload.title" label="Title" :rules="[(v) => !!v || 'Harus diisi']"
            variant="underlined" placeholder="Pembelian bensin" persistent-placeholder clearable />
          <v-text-field v-model="unmaskedamount" prefix="Rp" v-maska="options" :rules="[(v) => !!v || 'Harus diisi']"
            label="Nominal" variant="underlined" clearable />
          <v-select v-model="payload.fromFinancialAccountId" v-show="payload.tCode === 'M' || payload.tCode === 'D'"
            label="Akun Asal" :items="accounts" item-value="id" variant="underlined" />
          <v-date-input v-model="payload.tDate" prepend-icon="" variant="underlined" label="Tanggal Transaksi" />
        </v-form>
      </v-card-text>
      <v-card-actions>
        <v-btn variant="tonal" color="error" @click="form.reset()">batal</v-btn>
        <v-btn variant="tonal" color="primary" @click="doSubmit()">simpan</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>