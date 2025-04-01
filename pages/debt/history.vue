<script setup lang="ts">
definePageMeta({
  layout: 'secondlayer',
  middleware: 'auth'
})
const route = useRoute()
const id = route.query.id
let debtId = 0
if (typeof id === 'string') {
  debtId = parseInt(id)
}

const { getDebtHistory } = useDebtStore()
const { debt } = storeToRefs(useDebtStore())

await getDebtHistory(debtId)
</script>
<template>
  <v-row v-if="debt" class="mx-1 mt-2">
    <v-col cols="12" class="text-center">
      <div>{{ debt.title }}</div>
      <div class="text-caption">{{ toDate(debt.tDate) }}</div>
      <div class="my-3 text-body-2 font-weight-bold">Total: {{ toMoney(debt.sBalance) }}</div>

      <div class="d-flex flex-wrap justify-space-between">
        <div class="text-success font-weight-bold text-body-2">Terbayar: {{
          toMoney(debt.sBalance
            -
            debt.eBalance) }}
        </div>
        <div class="text-error text-body-2">Sisa: {{ toMoney(debt.eBalance) }}</div>
      </div>
      <v-divider class="mt-3 mb-0" />
    </v-col>
    <v-col v-if="debt.financialRecords" v-for="row in debt.financialRecords" cols="12" class="">
      <div :class="row.tCode === 'D' ? `text-red-darken-1` : `text-green-darken-1`">
        {{ toMoney(row.tCode === 'D' ? row.amountOut : row.tCode === 'C' ? row.amountIn : 0) }}
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