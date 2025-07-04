<script setup lang="ts">
import type { MaskInputOptions } from 'maska'
const { $debounce, $bus } = useNuxtApp()

const props = defineProps({
  transactiondate: { type: String, default: '' },
  hinttext: { type: String, default: '' }
})

const emit = defineEmits(['savesuccess'])

const { accounts } = storeToRefs(useAccountStore())
const { addMutation } = useRecordStore()

const payload = ref<Mutation>({
  title: '',
  amountOut: 0,
  fromFinancialAccountId: null,
  toFinancialAccountId: null,
  tDate: props.transactiondate
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
    await addMutation(payload.value)
    loading.value = false

    $bus.$emit('success-snackbar', 'Berhasil disimpan')
    emit('savesuccess')
  } catch (error) {
    loading.value = false
    $bus.$emit('error-snackbar', error)
  }
}, 1000, { leading: true, trailing: false })

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
        <v-text-field prefix="Rp" v-maska="options" label="Nominal*" :rules="[(v) => !!v || 'Harus diisi']"
          variant="underlined" clearable />
        <v-select v-model="payload.fromFinancialAccountId" label="Akun Asal*" :items="accounts" item-value="id"
          :rules="[(v) => !!v || 'Harus diisi']" variant="underlined" />
        <v-select v-model="payload.toFinancialAccountId" label="Akun Tujuan" :items="accounts" item-value="id"
          :rules="[(v) => !!v || 'Harus diisi']" variant="underlined" />
      </v-form>
    </v-card-text>
    <v-card-actions>
      <v-btn color="error" variant="tonal" @click="form.reset()" :loading="loading">batal</v-btn>
      <v-btn color="primary" variant="tonal" @click="doSave()" :loading="loading">simpan</v-btn>
    </v-card-actions>
  </v-card>
</template>