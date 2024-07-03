<script setup>
const props = defineProps({
  dialog: { type: Boolean, default: false },
  transactiondate: { type: String, default: null }
})
const transactionType = [
  { label: 'Kredit', value: 'C' },
  { label: 'Debit', value: 'D' },
  { label: 'Mutasi', value: 'M' },
  { label: 'Hutang', value: 'H' },
  { label: 'Piutang', value: 'P' }
]
const emit = defineEmits(['closeit'])
const dayjs = useDayjs()

const payload = ref({
  title: null,
  transactionType: 'C',
  amount: 0
})
const transactionDate = computed(() => dayjs(props.transactiondate).format('YYYY-MM-DD HH:mm:ss'))
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
      <v-card-text>
        <div class="text-center text-h6">{{ transactiondate }}</div>
        <v-radio-group v-model="payload.transactionType" inline>
          <v-radio v-for="row in transactionType" :label="row.label" :value="row.value" />
        </v-radio-group>
        <v-text-field v-model="payload.title" label="Title" variant="underlined" placeholder="Pembelian bensin"
          persistent-placeholder />
        <v-text-field v-model="payload.amount" :rules="[(v) => !!v || 'Required item']" label="Nominal"
          variant="underlined" type="number" />
        <v-select v-show="payload.transactionType === 'M' || payload.transactionType === 'D'" label="Akun Asal"
          :items="['CIMB', 'Dompet']" variant="underlined" />
        <v-select v-show="payload.transactionType === 'M' || payload.transactionType === 'C'" label="Akun Tujuan"
          :items="['CIMB', 'Dompet']" variant="underlined" />

        payload: {{ payload }}
        tdate: {{ transactiondate }}
        tdd: {{ transactionDate }}
      </v-card-text>
      <v-card-actions>
        <v-btn variant="tonal" color="error">batal</v-btn>
        <v-btn variant="tonal" color="primary">simpan</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>