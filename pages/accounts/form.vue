<script setup>
const { $bus, $debounce } = useNuxtApp()
const { addMyAccounts } = useAccountStore()

definePageMeta({
  layout: 'secondlayer'
})
$bus.$emit('set-header', 'Buat Akun')
const data = ref({
  title: null,
  sBalance: null
})
const checkbox = ref(false)
const form = ref()
const options = {
  number: { locale: 'id' },
  onMaska: (detail) => {
    data.value.sBalance = detail.unmasked
  }
}

const doSubmit = $debounce(async () => {
  try {
    const validate = await form.value.validate()
    if (!validate.valid) {
      return
    }
    $bus.$emit('wait-dialog', true)
    await addMyAccounts(data.value)
    navigateTo('/accounts', { replace: true })
    $bus.$emit('wait-dialog', false)
  } catch (error) {
    $bus.$emit('wait-dialog', false)
    $bus.$emit('eat-snackbar', error)
  }
})
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
          <v-btn @click="doSubmit()">simpan</v-btn>
        </div>
      </v-col>
    </v-row>
  </v-container>


</template>