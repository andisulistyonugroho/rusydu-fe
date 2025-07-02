<script setup lang="ts">
const { $dayjs, $debounce, $bus } = useNuxtApp()
const { getParents, addDebt } = useDebtStore()
const { parents } = storeToRefs(useDebtStore())

const emit = defineEmits(['reloadparent', 'closeit'])
const props = defineProps({
  dialog: { type: Boolean, default: false },
  budgetid: { type: Number, default: 0 },
  title: { type: String, default: null },
  amountleft: { type: Number, default: null }
})
const parentId = ref()

watch(props, (o, n) => {
  if (n.budgetid > 0) {
    getParents()
  }
})

const doSubmit = $debounce(async () => {
  try {
    $bus.$emit('wait-dialog', true)
    await addDebt({
      title: props.title,
      amount: props.amountleft,
      debtType: "bill",
      tDate: $dayjs().format(),
      toFinancialAccountId: 0,
      parentId: parentId.value
    })
    emit('closeit')
    emit('reloadparent', props.budgetid)
    $bus.$emit('wait-dialog', false)
  } catch (error) {
    $bus.$emit('wait-dialog', false)
    $bus.$emit('eat-snackbar', error)
  }
})
</script>
<template>
  <v-dialog v-model="props.dialog">
    <v-card variant="flat">
      <v-toolbar dark color="primary" flat>
        <v-btn icon="i-mdi-close" dark @click="emit('closeit')" />
        <v-toolbar-title>Hutang budget</v-toolbar-title>
      </v-toolbar>
      <v-card-text>
        <div>
          {{ props.title }}
        </div>
        <div class="text-red font-weight-bold">
          Rp {{ toMoney(props.amountleft) }}
        </div>
        <v-select label="Tambahkan ke hutang existing" v-model="parentId" :items="parents" item-value="id"
          variant="underlined" />
      </v-card-text>
      <v-card-actions>
        <v-btn color="primary" @click="doSubmit()">submit</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>