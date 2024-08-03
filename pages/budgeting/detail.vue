<script setup>
definePageMeta({
  layout: 'secondlayernohead',
  middleware: 'auth'
})
const { $bus, $dayjs } = useNuxtApp()
const route = useRoute()
const thePeriod = route.query.theperiod
const dialog = ref(false)

if (!thePeriod) {
  navigateTo('/budgeting')
}

const { getBudgetInPeriod } = useBudgetingStore()
const { budgets } = storeToRefs(useBudgetingStore())
const periodeString = ref('Budgeting')
const selectedData = ref({
  budgetId: null,
  selectedTitle: null,
  selectedAmount: null
})

if (thePeriod) {
  $bus.$emit('wait-dialog', true)
  await getBudgetInPeriod(thePeriod.toString())
  $bus.$emit('wait-dialog', false)
  periodeString.value = $dayjs(thePeriod.toString()).format('YYYY/MM')
}

const closeIt = () => {
  dialog.value = false
}

const openDialog = (id, title, amount) => {
  dialog.value = true
  selectedData.value.budgetId = id
  selectedData.value.selectedTitle = title
  selectedData.value.selectedAmount = amount
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
      <div :class="`text-caption ${row.amountLeft === 0 ? `text-green-darken-1` : ``}`">
        {{ toMoney(row.amountLeft ? row.amountLeft : row.amount) }}
      </div>
      <template v-slot:append>
        <v-menu>
          <template v-slot:activator="{ props }">
            <v-btn icon="i-mdi-dots-vertical" variant="text" v-bind="props"></v-btn>
          </template>

          <v-list dense>
            <v-list-item v-if="row.amountLeft > 0" @click="openDialog(row.id, row.title, row.amount)">
              <v-list-item-title>Bayar</v-list-item-title>
            </v-list-item>
            <v-list-item>
              <v-list-item-title>History</v-list-item-title>
            </v-list-item>
          </v-list>
        </v-menu>
      </template>
    </v-list-item>
  </v-list>
  <LazyInputBudgetRealisation :budgetid="selectedData.budgetId" :budgettitle="selectedData.selectedTitle"
    :dialog="dialog" :amount="selectedData.selectedAmount" :period="thePeriod" @closeit="closeIt" />
</template>