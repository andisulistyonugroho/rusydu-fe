<script setup>
const { $bus } = useNuxtApp()
definePageMeta({
  layout: 'secondlayer',
  middleware: 'auth'
})
const { getMyAccounts } = useAccountStore()
const { accounts } = storeToRefs(useAccountStore())

getMyAccounts()
$bus.$emit('set-header', 'Akun Harta')

const alert = ref(true)

</script>
<template>
  <div>
    <v-list>
      <v-list-item v-for="row in accounts" :title="row.title">
        <div class="font-weight-bold">{{ toMoney(row.eBalance) }}</div>
        <div class="text-caption">{{ formatDate(row.updatedAt) }}</div>
        <template v-slot:append>
          <v-btn icon="mdi-chevron-right" variant="text"></v-btn>
        </template>
      </v-list-item>
    </v-list>
    <div class="mx-4 my-4">
      <v-alert v-model="alert"
        text="Merupakan media tempat penyimpanan harta/uang anda. Contoh: Rekening Ayah, Rekening Bunda, Dompet Ayah, Dompet Bunda, Amplop, dll"
        title="Akun harta" type="info" variant="tonal" density="compact" closable />

    </div>
    <div class="text-center pt-5">
      <v-btn to="/accounts/form" class="text-capitalize">tambah akun</v-btn>
    </div>
  </div>
</template>