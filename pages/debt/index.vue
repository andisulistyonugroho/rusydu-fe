<script setup lang="ts">
const { $bus } = useNuxtApp()
definePageMeta({
  layout: 'secondlayer',
  middleware: 'auth'
})

const { getDebt } = useDebtStore()
const { debts } = storeToRefs(useDebtStore())

$bus.$emit('set-header', 'Hutang')
await getDebt()

const unpaid = computed(() => debts.value.reduce((total, obj) => (
  total += obj.eBalance
), 0))

const total = computed(() => debts.value.reduce((total, obj) => (
  total += obj.sBalance
), 0))

const paid = total.value - unpaid.value
</script>
<template>
  <v-list>
    <v-list-item>
      <v-btn size="small" block variant="flat" color="red">{{ toMoney(unpaid) }}</v-btn>
      <div class="mt-3 d-flex justify-space-between">
        <v-btn size="small" variant="tonal" color="black">{{ toMoney(total) }}</v-btn>
        <v-btn size="small" variant="tonal" color="success">{{ toMoney(paid) }}</v-btn>
      </div>
    </v-list-item>
    <v-divider></v-divider>
    <v-list-item v-for="row in debts" :title="row.title" :to="`/debt/detail?id=${row.id}`">
      <div class="text-caption">
        Hutang: {{ toMoney(row.sBalance) }}<br>
        Terbayar: {{ toMoney(row.sBalance - row.eBalance) }}<br>
        Sisa: {{ toMoney(row.eBalance) }}
      </div>
      <template v-slot:append>
        <v-btn icon="i-mdi-chevron-right" variant="text" />
      </template>
    </v-list-item>
  </v-list>
</template>