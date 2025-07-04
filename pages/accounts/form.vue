<script setup lang="ts">
import type { MaskInputOptions } from 'maska'

const { $bus, $debounce } = useNuxtApp()
const { addMyAccounts } = useAccountStore()

definePageMeta({
  layout: 'secondlayer',
  middleware: 'auth'
})
$bus.$emit('set-header', 'Buat Akun')
const data = ref({
  title: '',
  sBalance: 0
})
const checkbox = ref(false)
const form = ref()
const options = reactive<MaskInputOptions>({
  number: { locale: 'id' },
  onMaska: (detail) => {
    data.value.sBalance = parseFloat(detail.unmasked)
  }
})

const doSubmit = $debounce(async () => {
  try {
    const validate = await form.value.validate()
    if (!validate.valid) {
      return
    }
    $bus.$emit('wait-dialog', true)
    await addMyAccounts(data.value)
    navigateTo('/', { replace: true })
    $bus.$emit('wait-dialog', false)
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
          <v-text-field v-model="data.title" :rules="[v => !!v || 'tidak boleh kosong']" variant="underlined"
            label="Nama Akun*" />
          <v-text-field prefix="Rp" v-maska="options" variant="underlined" label="Saldo Awal*" />
          <v-checkbox v-model="checkbox" :rules="[v => !!v || 'harus dicentang']" label="Semua data sudah sesuai" />
        </v-form>
        <div class="text-right">
          <v-btn variant="tonal" @click="doSubmit()">simpan</v-btn>
        </div>
      </v-col>
    </v-row>
  </v-container>


</template>