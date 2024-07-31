<script setup>
definePageMeta({
  layout: 'secondlayer',
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

if (thePeriod) {
  await getBudgetInPeriod(thePeriod.toString())
  const periodeString = dayjs(thePeriod.toString()).format('MMMM YYYY')
  $bus.$emit('set-header', `Budgeting ${periodeString}`)
}


</script>
<template>
  <div>
    <v-list lines="one">
      <v-list-item v-for="row in budgets" :title="row.title">
        <div class="text-caption">{{ toMoney(row.amount) }}</div>
      </v-list-item>
    </v-list>
    <div class="text-center pt-5">
      <v-btn variant="tonal" to="/budgeting/form" class="text-capitalize">tambah</v-btn>
    </div>
  </div>
</template>