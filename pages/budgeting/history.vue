<script setup lang="ts">
definePageMeta({
  layout: 'secondlayer',
  middleware: 'auth'
})

const { $bus } = useNuxtApp()
const route = useRoute()
const budgetIdRoute = route.query.budgetid
let budgetId = 0
if (typeof budgetIdRoute === 'string') {
  budgetId = parseInt(budgetIdRoute)
}
const { budgets } = storeToRefs(useBudgetingStore())

$bus.$emit('set-header', 'History Budget')

const alert = ref(true)
let budget = ref()
budget = computed(() => { return budgets.value.find(obj => obj.id === budgetId) })

</script>
<template>
  <v-row class="mx-1 mt-2">
    <v-col cols="12" class="text-center">
      <div>{{ budget.title }}</div>
      <div class="text-caption">{{ formatDate(budget.thePeriod) }}</div>
      <div>Rp {{ toMoney(budget.amount) }}</div>
      <div>
        <span class="text-caption">used: </span>
        <span class="text-caption font-weight-bold text-red-darken-1">{{ toMoney(budget.amountUsed) }}</span>
        | <span class="text-caption">available: </span><span class="text-caption font-weight-bold text-info">{{
          toMoney(budget.amountLeft) }}</span>
      </div>
      <v-divider class="mt-3 mb-0" />
    </v-col>
    <v-col v-for="row in budget.financialRecords" cols="12" class="">
      <div class="text-red-darken-1">
        {{ toMoney(row.tCode === 'D' ? row.amountOut : row.tCode === 'C' ? row.amountIn : '') }}
      </div>
      <div class="text-caption">
        {{ row.title }}
      </div>
      <div class="text-caption text-grey-darken-2">
        {{ formatDate(row.tDate) }}
      </div>
    </v-col>
  </v-row>
</template>