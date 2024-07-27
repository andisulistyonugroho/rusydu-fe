<script setup>
const { $debounce } = useNuxtApp()

const props = defineProps({
  dialog: { type: Boolean, default: false },
  transactiondate: { type: String, default: null }
})
const transactionType = [
  { title: 'Keluar', value: 'D', desc: 'Uang keluar atau pembayaran' },
  { title: 'Masuk', value: 'C', desc: 'Uang masuk atau pendapatan' },
  { title: 'Transfer/mutasi', value: 'M', desc: 'Pindah uang dari satu akun ke akun lain' },
  { title: 'Hutang', value: 'H', desc: 'Dapat pinjaman' },
  { title: 'Piutang', value: 'P', desc: 'Kasih pinjaman' }
]
const emit = defineEmits(['closeit'])
const dayjs = useDayjs()

const payload = ref({
  title: null,
  tCode: null,
  amount: 0,
  fromFinancialAccountId: null,
  toFinancialAccountId: null
})
const transactionDate = computed(() => dayjs(props.transactiondate).format('YYYY-MM-DD HH:mm:ss'))
const hintType = computed(() => { return transactionType.find(obj => obj.value === payload.value.tCode)?.desc })
const options = {
  number: { locale: 'id' },
  onMaska: (detail) => {
    payload.value.amount = detail.unmasked
  }
}
const form = ref()
const doSubmit = $debounce(async () => {
  try {
    $bus.$emit('wait-dialog', true)

    $bus.$emit('wait-dialog', false)
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
        <v-btn icon dark @click="emit('closeit')">
          <v-icon>mdi-close</v-icon>
        </v-btn>
        <v-toolbar-title>Pencatatan</v-toolbar-title>
      </v-toolbar>
      <v-card-text v-if="!payload.tCode">
        <v-list>
          <v-list-item v-for="row in transactionType" :value="row.title" @click="payload.tCode = row.value">
            {{ row.title }}
            <v-list-item-subtitle>
              {{ row.desc }}
            </v-list-item-subtitle>
            <template v-slot:append>
              <v-btn color="grey-lighten-1" icon="mdi-chevron-right" variant="text"></v-btn>
            </template>
          </v-list-item>
        </v-list>
      </v-card-text>
      <v-card-text v-else>
        <div class="text-center text-h6">{{ transactiondate }}</div>
        <v-form ref="form">
          <v-select v-model="payload.tCode" label="Jenis transaksi" :rules="[(v) => !!v || 'Harus diisi']"
            :items="transactionType" variant="underlined" :hint="hintType" persistent-hint class="py-2" />
          <v-text-field v-model="payload.title" label="Title" :rules="[(v) => !!v || 'Harus diisi']"
            variant="underlined" placeholder="Pembelian bensin" persistent-placeholder />
          <v-text-field prefix="Rp" v-maska="options" :rules="[(v) => !!v || 'Harus diisi']" label="Nominal"
            variant="underlined" clearable />
          <v-select v-model="payload.fromFinancialAccountId" v-show="payload.tCode === 'M' || payload.tCode === 'D'"
            label="Akun Asal" :items="['CIMB', 'Dompet']" variant="underlined" />
          <v-select v-model="payload.toFinancialAccountId" v-show="payload.tCode === 'M' || payload.tCode === 'C'"
            label="Akun Tujuan" :items="['CIMB', 'Dompet']" variant="underlined" />
        </v-form>
        payload: {{ payload }}
        tdate: {{ transactiondate }}
        tdd: {{ transactionDate }}
      </v-card-text>
      <v-card-actions v-if="payload.tCode">
        <v-btn variant="tonal" color="error" @click="form.reset()">batal</v-btn>
        <v-btn variant="tonal" color="primary" @click="doSubmit()">simpan</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>