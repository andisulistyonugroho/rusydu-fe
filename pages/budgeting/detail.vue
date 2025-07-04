<script setup lang="ts">
definePageMeta({
  layout: 'secondlayernohead',
  middleware: 'auth'
})
const { $bus, $dayjs, $debounce } = useNuxtApp()
const route = useRoute()
let thePeriod = $dayjs().format()
if (route.query.theperiod) {
  thePeriod = route.query.theperiod.toString()
}

const dialog = ref(false)
const debtDialog = ref({
  dialog: false,
  budgetId: 0,
  title: "",
  amountLeft: 0
})

if (!thePeriod) {
  navigateTo('/budgeting')
}

const { getBudgetInPeriod, setAsCompleted } = useBudgetingStore()
const { budgets } = storeToRefs(useBudgetingStore())
const periodeString = ref('Budgeting')
const selectedData = ref({
  budgetId: 0,
  selectedTitle: '',
  selectedAmount: 0
})

if (thePeriod) {
  $bus.$emit('wait-dialog', true)
  await getBudgetInPeriod(thePeriod)
  $bus.$emit('wait-dialog', false)
  periodeString.value = $dayjs(thePeriod.toString()).format('YYYY/MM')
}

const closeIt = () => {
  dialog.value = false
  debtDialog.value.dialog = false
}

const openDialog = (id: number, title: string, amount: number) => {
  dialog.value = true
  selectedData.value.budgetId = id
  selectedData.value.selectedTitle = title
  selectedData.value.selectedAmount = amount
}

const openBudgetDebt = (id: number, title: string, amountLeft: number) => {
  debtDialog.value.dialog = true
  debtDialog.value.budgetId = id
  debtDialog.value.title = title
  debtDialog.value.amountLeft = amountLeft
}

const budgetDebtReloadParent = async (id: number) => {
  $bus.$emit('wait-dialog', true)
  await setAsCompleted(id)
  await getBudgetInPeriod(thePeriod)
  $bus.$emit('wait-dialog', false)
}

const setAsComplete = $debounce(async (id) => {
  try {
    if (window.confirm("Alokasi budget akan dicukupkan, anda yakin?")) {
      $bus.$emit('wait-dialog', true)
      await setAsCompleted(id)
      await getBudgetInPeriod(thePeriod)
      $bus.$emit('wait-dialog', false)
    }
  } catch (error) {
    $bus.$emit('wait-dialog', false)
    $bus.$emit('error-snackbar', error)
  }
}, 1000, { leading: true, trailing: false })

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

          <v-list density="compact">
            <v-list-item v-if="row.amountLeft > 0" @click="openDialog(row.id, row.title, row.amount)">
              <v-list-item-title>Bayar</v-list-item-title>
            </v-list-item>
            <v-list-item v-if="row.amountLeft > 0" @click="setAsComplete(row.id)">
              <v-list-item-title>Cukupkan</v-list-item-title>
            </v-list-item>
            <v-list-item v-if="row.amountLeft > 0">
              <v-list-item-title>Batalkan</v-list-item-title>
            </v-list-item>
            <v-list-item v-if="row.amountLeft > 0" @click="openBudgetDebt(row.id, row.title, row.amountLeft)">
              <v-list-item-title>Hutang</v-list-item-title>
            </v-list-item>
            <v-list-item :to="`/budgeting/history?budgetid=${row.id}`">
              <v-list-item-title>History</v-list-item-title>
            </v-list-item>
          </v-list>
        </v-menu>
      </template>
    </v-list-item>
  </v-list>
  <LazyInputBudgetRealisation :budgetid="selectedData.budgetId" :budgettitle="selectedData.selectedTitle"
    :dialog="dialog" :amount="selectedData.selectedAmount" :period="thePeriod" @closeit="closeIt" />
  <LazyBudgetDebt :dialog="debtDialog.dialog" :budgetid="debtDialog.budgetId" :title="debtDialog.title"
    :amountleft="debtDialog.amountLeft" @closeit="closeIt" @reloadparent="budgetDebtReloadParent" />
</template>