<script setup lang="ts">
const dialog = defineModel<boolean>("dialog");
const emit = defineEmits(["savesuccess"]);
const props = defineProps({
  accountid: { type: Number, default: 0 },
});
const transactionType = [
  {
    title: "Pengeluaran",
    value: "D",
    desc: "Uang keluar atau pembayaran",
    color: "info",
    icon: "i-mdi-clipboard-text",
  },
  {
    title: "Pemasukan",
    value: "C",
    desc: "Uang masuk atau pendapatan",
    color: "green",
    icon: "i-mdi-cash-register",
  },
];

const hintType = computed(() => {
  return transactionType.find((obj) => obj.value === tCode.value)?.desc;
});
const transactionTypeTitle = computed(
  () => transactionType.find((obj) => obj.value === tCode.value)?.title,
);
const dialogColor = computed(() => {
  return transactionType.find((obj) => obj.value === tCode.value)?.color;
});

const tCode = ref();
</script>
<template>
  <v-dialog v-model="dialog">
    <v-toolbar class="rounded-t-lg" :color="dialogColor ? dialogColor : ``">
      <v-btn v-if="!tCode" icon="i-mdi-close" dark @click="dialog = false" />
      <v-btn v-else icon="i-mdi-arrow-left" dark @click="tCode = null" />
      <v-toolbar-title>{{
        tCode ? transactionTypeTitle : "Pencatatan"
      }}</v-toolbar-title>
    </v-toolbar>
    <div v-if="!tCode">
      <v-list class="rounded-b-lg">
        <v-list-item
          v-for="row in transactionType"
          :value="row.title"
          @click="tCode = row.value"
        >
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
    <LazyAccountIncomeForm
      v-if="tCode === 'C'"
      :accountid="props.accountid"
      :hinttext="hintType"
      @savesuccess="
        dialog = false;
        emit('savesuccess');
      "
    />
    <LazyAccountSpendingForm
      v-if="tCode === 'D'"
      :accountid="props.accountid"
      :hinttext="hintType"
      @savesuccess="
        dialog = false;
        emit('savesuccess');
      "
    />
  </v-dialog>
</template>
