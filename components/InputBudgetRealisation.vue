<script setup>
const props = defineProps({
  dialog: { type: Boolean, default: false },
  transactiondate: { type: String, default: null }
})
const { $dayjs } = useNuxtApp()
const { getMyAccounts } = useAccountStore()
const { accounts } = storeToRefs(useAccountStore())
const emit = defineEmits(['closeit'])
const options = {
  number: { locale: 'id' },
  onMaska: (detail) => {
    payload.value.amount = detail.unmasked
  }
}

const transactionDate = computed(() => $dayjs(props.transactiondate).format('YYYY-MM-DD HH:mm:ss'))

const payload = ref({
  title: null,
  tCode: 'D',
  amount: 0,
  fromFinancialAccountId: null,
  tDate: transactionDate
})

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
        <v-form ref="form">
          <v-text-field v-model="payload.title" label="Title" :rules="[(v) => !!v || 'Harus diisi']"
            variant="underlined" placeholder="Pembelian bensin" persistent-placeholder clearable />
          <v-text-field prefix="Rp" v-maska="options" :rules="[(v) => !!v || 'Harus diisi']" label="Nominal"
            variant="underlined" clearable />
          <v-select v-model="payload.fromFinancialAccountId" v-show="payload.tCode === 'M' || payload.tCode === 'D'"
            label="Akun Asal" :items="accounts" item-value="id" variant="underlined" />
          <v-date-input v-model="payload.tDate" prepend-icon="" variant="underlined" label="Tanggal Transaksi" />
        </v-form>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>