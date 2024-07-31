<script setup>
const { $debounce, $bus } = useNuxtApp()
const { addRecord } = useRecordStore()
const { getTotalBalance } = useAccountStore()
const { accounts } = storeToRefs(useAccountStore())

const props = defineProps({
  dialog: { type: Boolean, default: false },
  transactiondate: { type: String, default: null }
})
const transactionType = [
  { title: 'Pengeluaran', value: 'D', desc: 'Uang keluar atau pembayaran' },
  { title: 'Pemasukan', value: 'C', desc: 'Uang masuk atau pendapatan' },
  { title: 'Transfer/mutasi', value: 'M', desc: 'Pindah uang dari satu akun ke akun lain' },
  { title: 'Hutang', value: 'H', desc: 'Dapat pinjaman atau tunggakan' },
  { title: 'Piutang', value: 'P', desc: 'Kasih pinjaman' }
]
const emit = defineEmits(['closeit', 'refreshparent'])
const dayjs = useDayjs()

const transactionDate = computed(() => dayjs(props.transactiondate).format('YYYY-MM-DD HH:mm:ss'))
const hintType = computed(() => { return transactionType.find(obj => obj.value === payload.value.tCode)?.desc })
const options = {
  number: { locale: 'id' },
  onMaska: (detail) => {
    payload.value.amount = detail.unmasked
  }
}
const form = ref()
const payload = ref({
  title: null,
  tCode: null,
  amount: 0,
  fromFinancialAccountId: null,
  toFinancialAccountId: null,
  tDate: transactionDate
})

const doSubmit = $debounce(async () => {
  try {
    $bus.$emit('wait-dialog', true)
    await addRecord(payload.value)
    getTotalBalance()
    emit('refreshparent')
    $bus.$emit('wait-dialog', false)
    $bus.$emit('eat-snackbar', 'Catatan berhasil disimpan')
    payload.value.tCode = null
  } catch (error) {
    $bus.$emit('wait-dialog', false)
    $bus.$emit('eat-snackbar', error)
  }
}, 1000, { leading: true, trailing: false })
</script>
<template>
  <v-dialog v-model="props.dialog">
    <v-card flat>
      <v-toolbar dark color="primary">
        <v-btn v-if="!payload.tCode" icon="i-mdi-close" dark @click="emit('closeit')" />
        <v-btn v-else icon="i-mdi-arrow-left" dark @click="payload.tCode = null" />
        <v-toolbar-title>Pencatatan</v-toolbar-title>
      </v-toolbar>
      <v-list v-if="!payload.tCode">
        <v-list-item v-for="row in transactionType" :value="row.title" @click="payload.tCode = row.value">
          {{ row.title }}
          <v-list-item-subtitle>
            {{ row.desc }}
          </v-list-item-subtitle>
          <template v-slot:append>
            <v-btn color="grey-lighten-1" icon="i-mdi-chevron-right" variant="text"></v-btn>
          </template>
        </v-list-item>
      </v-list>
      <v-card-text v-else>
        <div class="text-center text-h6">{{ transactiondate }}</div>
        <v-form ref="form">
          <v-select v-model="payload.tCode" label="Jenis transaksi" :rules="[(v) => !!v || 'Harus diisi']"
            :items="transactionType" variant="underlined" :hint="hintType" persistent-hint class="py-2" />
          <v-text-field v-model="payload.title" label="Title" :rules="[(v) => !!v || 'Harus diisi']"
            variant="underlined" placeholder="Pembelian bensin" persistent-placeholder clearable />
          <v-text-field prefix="Rp" v-maska="options" :rules="[(v) => !!v || 'Harus diisi']" label="Nominal"
            variant="underlined" clearable />
          <v-select v-model="payload.fromFinancialAccountId" v-show="payload.tCode === 'M' || payload.tCode === 'D'"
            label="Akun Asal" :items="accounts" item-value="id" variant="underlined" />
          <v-select v-model="payload.toFinancialAccountId" v-show="payload.tCode === 'M' || payload.tCode === 'C'"
            label="Akun Tujuan" :items="accounts" item-value="id" variant="underlined" />
        </v-form>
      </v-card-text>
      <v-card-actions v-if="payload.tCode">
        <v-btn variant="tonal" color="error" @click="form.reset()">batal</v-btn>
        <v-btn variant="tonal" color="primary" @click="doSubmit()">simpan</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>