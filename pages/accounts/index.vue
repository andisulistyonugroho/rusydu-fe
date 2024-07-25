<script setup>
console.log('accounts')
const { $bus } = useNuxtApp()
definePageMeta({
  layout: 'secondlayer',
  middleware: 'auth'
})
const { getMyAccounts, accounts } = useAccountStore()

getMyAccounts()
$bus.$emit('set-header', 'Akun Keuangan')
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
    <div class="text-center pt-5">
      <v-btn to="/accounts/form">tambah</v-btn>
    </div>
  </div>
</template>