<script setup lang="ts">
import type { MaskInputOptions } from 'maska'

const { $dayjs } = useNuxtApp()
const { getTotalBalance } = useAccountStore()

const props = defineProps({
  dialog: { type: Boolean, default: false },
  transactiondate: { type: String, default: null }
})
const transactionType = [
  { title: 'Pengeluaran', value: 'D', desc: 'Uang keluar atau pembayaran', color: 'info', icon: 'i-mdi-clipboard-text' },
  { title: 'Pemasukan', value: 'C', desc: 'Uang masuk atau pendapatan', color: 'green', icon: 'i-mdi-cash-register' },
  { title: 'Transfer/mutasi', value: 'M', desc: 'Pindah uang dari satu akun ke akun lain', color: 'yellow', icon: 'i-mdi-swap-horizontal' },
  { title: 'Hutang', value: 'H', desc: 'Dapat pinjaman atau tunggakan', color: 'red', icon: 'i-mdi-ambulance' }
]
const emit = defineEmits(['closeit', 'refreshparent'])

const transactionDate = computed(() => $dayjs(props.transactiondate).subtract(7, 'hours').format('YYYY-MM-DD HH:mm:ss'))
const hintType = computed(() => { return transactionType.find(obj => obj.value === tCode.value)?.desc })
const transactionTypeTitle = computed(() => transactionType.find(obj => obj.value === tCode.value)?.title)
const dialogColor = computed(() => { return transactionType.find(obj => obj.value === tCode.value)?.color })

const tCode = ref()

const saveSuccess = () => {
  getTotalBalance()
  emit('refreshparent')
  tCode.value = null
}
</script>
<template>
  <v-dialog v-model="props.dialog">
    <v-toolbar class="rounded-t-lg" :color="dialogColor ? dialogColor : ``">
      <v-btn v-if="!tCode" icon="i-mdi-close" dark @click="emit('closeit')" />
      <v-btn v-else icon="i-mdi-arrow-left" dark @click="tCode = null" />
      <v-toolbar-title>{{ tCode ? transactionTypeTitle : 'Pencatatan' }}</v-toolbar-title>
    </v-toolbar>
    <div v-if="!tCode">
      <v-list class="rounded-b-lg">
        <v-list-item v-for="row in transactionType" :value="row.title" @click="tCode = row.value">
          <template v-slot:prepend>
            <v-avatar :color="row.color">
              <v-icon :icon="row.icon" />
            </v-avatar>
          </template>
          {{ row.title }}
          <v-list-item-subtitle>
            {{ row.desc }}
          </v-list-item-subtitle>
          <template v-slot:append>
            <v-btn icon="i-mdi-chevron-right" variant="text"></v-btn>
          </template>
        </v-list-item>
      </v-list>
    </div>
    <LazyIncomeForm v-if="tCode === 'C'" :transactiondate="transactiondate" :hinttext="hintType"
      @savesuccess="saveSuccess" />
    <LazySpendingForm v-else-if="tCode === 'D'" :transactiondate="transactiondate" :hinttext="hintType"
      @savesuccess="saveSuccess" />
    <LazyMutationForm v-else-if="tCode === 'M'" :transactiondate="transactiondate" :hinttext="hintType"
      @savesuccess="saveSuccess" />
    <LazyDebtForm v-else-if="tCode === 'H'" :transactiondate="transactiondate" :hinttext="hintType"
      @savesuccess="saveSuccess" />
  </v-dialog>
</template>