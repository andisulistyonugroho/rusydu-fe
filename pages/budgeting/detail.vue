<script setup>
definePageMeta({
  layout: 'secondlayernohead',
  middleware: 'auth'
})
const { $bus } = useNuxtApp()
const route = useRoute()
const dayjs = useDayjs()
const thePeriod = route.query.theperiod

if (!thePeriod) {
  navigateTo('/budgeting')
}

const { getBudgetInPeriod } = useBudgetingStore()
const { budgets } = storeToRefs(useBudgetingStore())
const periodeString = ref('Budgeting')

if (thePeriod) {
  await getBudgetInPeriod(thePeriod.toString())
  periodeString.value = dayjs(thePeriod.toString()).format('YYYY/MM')

}


</script>
<template>
  <v-app-bar class="border-b">
    <v-btn icon="i-mdi-arrow-left" @click="$router.back()" />
    <v-app-bar-title>Budgeting {{ periodeString }}</v-app-bar-title>
    <v-btn icon="i-mdi-plus" :to="`/budgeting/form?theperiod=${thePeriod}`" />
  </v-app-bar>
  <v-list lines="one">
    <v-list-item v-for="row in budgets" :title="row.title">
      <div class="text-caption">{{ toMoney(row.amount) }}</div>
    </v-list-item>
  </v-list>
</template>