<script setup lang="ts">
import type { MaskInputOptions } from 'maska'

definePageMeta({
  layout: 'secondlayer',
  middleware: 'auth'
})

const { $bus, $debounce, $dayjs, $router } = useNuxtApp()
const { addMyBudget } = useBudgetingStore()
const route = useRoute()

const thePeriod = route.query.theperiod
$bus.$emit('set-header', 'Buat Budget')
const data = ref({
  title: '',
  thePeriod: '',
  amount: 0
})
const months = [
  { title: 'Januari', value: '01' },
  { title: 'Pebruari', value: '02' },
  { title: 'Maret', value: '03' },
  { title: 'April', value: '04' },
  { title: 'Mei', value: '05' },
  { title: 'Juni', value: '06' },
  { title: 'Juli', value: '07' },
  { title: 'Agustus', value: '08' },
  { title: 'September', value: '09' },
  { title: 'Oktober', value: ' 10' },
  { title: 'Nopember', value: '11' },
  { title: 'Desember', value: '12' }
]
const checkbox = ref(false)
const form = ref()
const year = ref($dayjs().format('YYYY'))
const month = ref($dayjs().format('MM'))

if (thePeriod) {
  year.value = $dayjs(thePeriod.toString()).format('YYYY')
  month.value = $dayjs(thePeriod.toString()).format('MM')
}

const years = computed(() => {
  const y = $dayjs().format('YYYY')
  return [y, parseInt(y) + 1]
})
const options = reactive<MaskInputOptions>({
  number: { locale: 'id' },
  onMaska: (detail) => {
    data.value.amount = parseFloat(detail.unmasked)
  }
})

const periode = computed(() => {
  return `${year.value}-${month.value}-01 00:00:00`
})

const doSubmit = $debounce(async () => {
  try {
    const validate = await form.value.validate()
    if (!validate.valid) {
      return
    }
    $bus.$emit('wait-dialog', true)
    data.value.thePeriod = periode.value
    await addMyBudget(data.value)
    $router.back()
    $bus.$emit('wait-dialog', false)
    $bus.$emit('success-snackbar', 'Budget berhasil disimpan')
  } catch (error) {
    $bus.$emit('wait-dialog', false)
    $bus.$emit('error-snackbar', error)
  }
}, 1000, { leading: true, trailing: false })
</script>
<template>
  <v-container fluid>
    <v-row no-gutters>
      <v-col cols="12">
        <v-form ref="form" lazy-validation>
          <v-row no-gutters>
            <v-col cols="6">
              <v-select v-model="year" :items="years" label="Tahun" variant="underlined" />
            </v-col>
            <v-col cols="6">
              <v-select v-model="month" label="Bulan" :items="months" variant="underlined" />
            </v-col>
          </v-row>
          <v-text-field v-model="data.title" :rules="[v => !!v || 'tidak boleh kosong']" variant="underlined"
            label="Deskripsi*" />
          <v-text-field prefix="Rp" v-maska="options" variant="underlined" label="Amount*" />
          <v-checkbox v-model="checkbox" :rules="[v => !!v || 'harus dicentang']" label="Semua data sudah sesuai" />
        </v-form>
        <div class="text-right">
          <v-btn variant="tonal" @click="doSubmit()">simpan</v-btn>
        </div>
      </v-col>
    </v-row>
  </v-container>


</template>