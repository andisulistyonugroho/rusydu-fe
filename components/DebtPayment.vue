<script setup lang="ts">
const props = defineProps({
  debtid: { type: Number, default: null },
  debttitle: { type: String, default: null },
  debtamount: { type: Number, default: null }
})
const { $dayjs, $debounce, $bus } = useNuxtApp()
const { getMyAccounts } = useAccountStore()
const { accounts } = storeToRefs(useAccountStore())
const { payDebt } = useDebtStore()
const { getBudgetInPeriod } = useBudgetingStore()
const { budgets } = storeToRefs(useBudgetingStore())

const emit = defineEmits(['refreshparent', 'closeit'])
const form = ref()

const payload = ref({
  title: '',
  tCode: 'D',
  amount: 0,
  tDate: $dayjs().format(),
  fromFinancialAccountId: 0,
  debtId: props.debtid,
  monthlyBudgetId: null,
})

const options = {
  number: { locale: 'id' },
  onMaska: (detail: any) => {
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
    await payDebt(payload.value)
    emit('refreshparent')
    emit('closeit')
    $bus.$emit('wait-dialog', false)
  } catch (error) {
    $bus.$emit('wait-dialog', false)
    $bus.$emit('eat-snackbar', error)
  }
}, 1000, { leading: true, trailing: false })

const getBudget = async () => {
  try {
    $bus.$emit('wait-dialog', true)
    const period = `${$dayjs().format('YYYY-MM')}-01 00:00:00`
    await getBudgetInPeriod(period)
    $bus.$emit('wait-dialog', false)
  } catch (error) {
    $bus.$emit('wait-dialog', false)
    $bus.$emit('eat-snackbar', error)
  }
}

await getMyAccounts()
await getBudget()
</script>
<template>
  <v-card variant="flat">
    <v-toolbar dark color="primary" flat>
      <v-btn icon="i-mdi-close" dark @click="emit('closeit')" />
      <v-toolbar-title>Pelunasan</v-toolbar-title>
    </v-toolbar>
    <v-card-text>
      <div class="text-center">
        {{ props.debttitle }}
      </div>
      <div class="text-center">
        Sisa: {{ toMoney(props.debtamount) }}
      </div>
      <v-divider class="my-3"></v-divider>
      <v-form ref="form">
        <v-text-field v-model="payload.title" label="Title*" :rules="[(v) => !!v || 'Harus diisi']" variant="underlined"
          placeholder="Bayar-bayar" persistent-placeholder clearable />
        <v-text-field prefix="Rp" v-maska="options" :rules="[(v) => !!v || 'Harus diisi']" label="Nominal"
          variant="underlined" placeholder="0" persistent-placeholder clearable />
        <v-select v-model="payload.fromFinancialAccountId" label="Akun Asal*" :items="accounts" item-value="id"
          variant="underlined" />
        <v-date-input v-model="payload.tDate" prepend-icon="" variant="underlined" label="Tanggal Transaksi*" />
        <v-select v-model="payload.monthlyBudgetId" label="Ambil dari budget" :items="budgets" item-value="id"
          variant="underlined" clearable>
          <template v-slot:item="{ props: itemProps, item }">
            <v-list-item v-bind="itemProps" :subtitle="toMoney(item.raw.amountLeft)"></v-list-item>
          </template>
        </v-select>
      </v-form>
      {{ payload }}
    </v-card-text>
    <v-card-actions>
      <v-btn variant="tonal" color="error" @click="form.reset()">batal</v-btn>
      <v-btn variant="tonal" color="primary" @click="doSubmit()">simpan</v-btn>
    </v-card-actions>
  </v-card>
</template>