<script setup lang="ts">
const { $bus, $debounce } = useNuxtApp()
definePageMeta({
  layout: 'secondlayer',
  middleware: 'auth'
})

const { getDebt } = useDebtStore()
const { debts } = storeToRefs(useDebtStore())

$bus.$emit('set-header', 'Hutang')

const unpaid = computed(() => debts.value.reduce((total, obj) => (
  total += obj.eBalance
), 0))
const total = computed(() => debts.value.reduce((total, obj) => (
  total += obj.sBalance
), 0))
const paid = computed(() => total.value - unpaid.value)

const dialog = ref(false)
const selectedDebtId = ref()
const selectedDebtTitle = ref()
const selectedDebtAmount = ref()

const openDialog = $debounce(async (data: { id: number, title: string, eBalance: number }) => {
  dialog.value = true
  selectedDebtId.value = data.id
  selectedDebtTitle.value = data.title
  selectedDebtAmount.value = data.eBalance
}, 1000, { leading: true, trailing: false })

const closeIt = () => {
  dialog.value = false
}

const refreshParent = async () => {
  await getDebt()
}

refreshParent()
</script>
<template>
  <v-list>
    <v-list-item>
      <v-btn block variant="tonal" color="red" class="font-weight-black text-capitalize">sisa: {{
        toMoney(unpaid)
        }}</v-btn>
      <div class="mt-3 d-flex justify-space-between">
        <v-btn variant="flat" color="black" class="text-capitalize">hutang: {{ toMoney(total) }}</v-btn>
        <v-btn variant="flat" color="success" class="text-capitalize">lunas: {{ toMoney(paid)
        }}</v-btn>
      </div>
    </v-list-item>
    <v-divider></v-divider>
    <v-list-item v-for="row in debts" :title="row.title">
      <div class="text-caption">
        Hutang: {{ toMoney(row.sBalance) }}<br>
        Terbayar: {{ toMoney(row.sBalance - row.eBalance) }}<br>
        Sisa: {{ toMoney(row.eBalance) }}
      </div>
      <template v-slot:append>
        <v-menu>
          <template v-slot:activator="{ props }">
            <v-btn icon="i-mdi-dots-vertical" variant="text" v-bind="props"></v-btn>
          </template>

          <v-list density="compact">
            <v-list-item v-if="row.eBalance > 0">
              <v-list-item-title @click="openDialog(row)">Bayar</v-list-item-title>
            </v-list-item>
            <v-list-item :to="`/debt/history?id=${row.id}`">
              <v-list-item-title>History</v-list-item-title>
            </v-list-item>
          </v-list>
        </v-menu>
      </template>
    </v-list-item>
  </v-list>
  <v-dialog v-model="dialog" :debtid="selectedDebtId">
    <LazyDebtPayment v-if="dialog" :debtid="selectedDebtId" :debttitle="selectedDebtTitle"
      :debtamount="selectedDebtAmount" @closeit="closeIt()" @refreshparent="refreshParent()" />
  </v-dialog>
</template>