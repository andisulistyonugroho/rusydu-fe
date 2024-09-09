<script setup>
const { $bus } = useNuxtApp()
definePageMeta({
  layout: 'secondlayer',
  middleware: 'auth'
})
const { getAvailableMonth } = useBudgetingStore()
const { availableMonths } = storeToRefs(useBudgetingStore())

await getAvailableMonth()
$bus.$emit('set-header', 'Budgeting')

const alert = ref(true)

</script>
<template>
  <div>
    <v-list>
      <v-list-item v-for="row in availableMonths" :title="row.title"
        :to="`/budgeting/detail?theperiod=${row.thePeriod}`">
        <div class="font-weight-bold">{{ toMonth(row.thePeriod) }} : {{ toMoney(row.amount) }}</div>
        <div class="text-body-2">
          Terpakai: {{ toMoney(row.amountUsed) }},
          Sisa: {{ toMoney(row.amountLeft) }}
        </div>
        <template v-slot:append>
          <v-btn icon="i-mdi-chevron-right" variant="text" :to="`/budgeting/detail?theperiod=${row.thePeriod}`" />
        </template>
      </v-list-item>
    </v-list>
    <div class="mx-4 my-4">
      <v-alert v-model="alert" color="primary" text="Merupakan rencana alokasi dana untuk memenuhi kebutuhan bulanan"
        title="Budgeting" type="info" variant="tonal" class="text-caption" closable />

    </div>
    <div class="mx-4 pt-5">
      <v-btn variant="tonal" to="/budgeting/form" block>tambah</v-btn>
      <v-btn variant="tonal" to="/budgeting/copy" class="mt-2" block>Salin budget</v-btn>
    </div>
  </div>
</template>