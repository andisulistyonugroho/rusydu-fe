<script setup lang="ts">
import type { MaskInputOptions } from 'maska'
const { $dayjs, $debounce, $bus } = useNuxtApp()

const props = defineProps({
  transactiondate: { type: String, default: '' },
  hinttext: { type: String, default: '' }
})

const emit = defineEmits(['savesuccess'])

const { addSpending } = useRecordStore()
const { accounts } = storeToRefs(useAccountStore())
const { getBudgetAvailableInPeriod } = useBudgetingStore()
const { availableBudgets } = storeToRefs(useBudgetingStore())

const payload = ref<Spending>({
  title: '',
  amountOut: 0,
  financialAccountId: null,
  tDate: props.transactiondate,
  monthlyBudgetId: null
})
const form = ref()
const loading = ref(false)
const options = reactive<MaskInputOptions>({
  number: { locale: 'id' },
  onMaska: (detail) => {
    payload.value.amountOut = parseFloat(detail.unmasked)
  }
})

const doSave = $debounce(async () => {
  try {
    const validate = await form.value.validate()
    if (!validate.valid) {
      return
    }

    loading.value = true
    await addSpending(payload.value)
    loading.value = false

    $bus.$emit('success-snackbar', 'Berhasil disimpan')
    emit('savesuccess')
  } catch (error) {
    loading.value = false
    $bus.$emit('error-snackbar', error)
  }
}, 1000, { leading: true, trailing: false })

const period = $dayjs(props.transactiondate).format('YYYY-MM-01 00:00:00')
await getBudgetAvailableInPeriod(period)

</script>
<template>
  <v-card flat rounded="t-0 b-lg">
    <v-card-text>
      <div class="text-center text-h6">{{ props.transactiondate }}</div>
      <div class="text-center pb-2">
        {{ hinttext }}
      </div>
      <v-form ref="form">
        <v-text-field v-model="payload.title" label="Title*" :rules="[(v) => !!v || 'Harus diisi']" variant="underlined"
          placeholder="Pembelian bensin" persistent-placeholder clearable />
        <v-text-field prefix="Rp" v-maska="options" :rules="[(v) => !!v || 'Harus diisi']" label="Nominal*"
          variant="underlined" clearable />
        <v-select v-model="payload.financialAccountId" label="Akun Asal*" :items="accounts"
          :rules="[(v) => !!v || 'Harus diisi']" item-value="id" variant="underlined" />
        <v-select v-model="payload.monthlyBudgetId" label="Ambil dari budget" :items="availableBudgets" item-value="id"
          variant="underlined" clearable>
          <template v-slot:item="{ props: itemProps, item }">
            <v-list-item v-bind="itemProps" :subtitle="toMoney(item.raw.amountLeft)"></v-list-item>
          </template>
        </v-select>
      </v-form>
    </v-card-text>
    <v-card-actions>
      <v-btn color="error" variant="tonal" @click="form.reset()" :loading="loading">batal</v-btn>
      <v-btn color="primary" variant="tonal" @click="doSave()" :loading="loading">simpan</v-btn>
    </v-card-actions>
  </v-card>
</template>