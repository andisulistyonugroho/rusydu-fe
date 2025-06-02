<script setup lang="ts">
const { $bus, $dayjs } = useNuxtApp()
definePageMeta({
  layout: 'noheader',
  middleware: 'auth'
})
const { getMyAccounts } = useAccountStore()
const { accounts, totalBalance } = storeToRefs(useAccountStore())

getMyAccounts()
$bus.$emit('set-header', 'Akun Harta')

const alert = ref(true)

</script>
<template>
  <v-app-bar extended class="border-b">
    <v-app-bar-nav-icon @click="$bus.$emit('open-drawer')"></v-app-bar-nav-icon>
    <v-app-bar-title>Akun</v-app-bar-title>
    <v-btn icon="i-mdi-plus" @click="addNew({ text: $dayjs().format('ddd, DD MMM YYYY') })" />
    <template v-slot:extension>
      <div class="w-100 text-center font-weight-bold">
        Saldo: {{ toMoney(totalBalance) }}
      </div>
    </template>
  </v-app-bar>
  <div>
    <v-list>
      <v-list-item v-for="row in accounts" :title="row.title" :to="`/accounts/history?accountId=${row.id}`">
        <div class="font-weight-bold">{{ toMoney(row.eBalance) }}</div>
        <div class="text-caption">{{ formatDate(row.updatedAt) }}</div>
        <template v-slot:append>
          <v-icon>i-mdi-chevron-right</v-icon>
        </template>
      </v-list-item>
    </v-list>
    <div class="mx-4 my-4">
      <v-alert v-model="alert" color="primary"
        text="Merupakan media tempat penyimpanan harta/uang anda. Contoh: Rekening Ayah, Rekening Bunda, Dompet Ayah, Dompet Bunda, Amplop, dll"
        title="Akun harta" type="info" variant="tonal" density="compact" closable />

    </div>
    <div class="text-center pt-5">
      <v-btn variant="tonal" to="/accounts/form" class="text-capitalize">tambah akun</v-btn>
    </div>
  </div>
</template>