<script setup lang="ts">
definePageMeta({
  layout: "secondlayernohead",
  middleware: "auth",
});
const { callHook } = useNuxtApp();
const { $debounce } = useNuxtApp();
const { findRecord } = useRecordStore();

const { searchResult } = storeToRefs(useRecordStore());

callHook("setHeader", "Pencarian");

const title = ref("");

const doFilter = $debounce(
  async () => {
    if (!title.value) {
      return;
    }
    await findRecord({ title: title.value });
  },
  1000,
  { leading: true, trailing: false },
);

const total = computed(() => {
  return searchResult.value.reduce((amount, obj) => {
    return amount + obj.amountIn - obj.amountOut;
  }, 0);
});
</script>

<template>
  <v-app-bar class="border-b">
    <v-btn icon="i-mdi-arrow-left" @click="$router.back()" />
    <v-app-bar-title>Pencarian</v-app-bar-title>
    <template v-slot:extension>
      <div class="w-100 mx-4">
        <v-text-field
          v-model="title"
          label="Pencarian"
          placeholder="beli bensin"
          persistent-placeholder
          variant="underlined"
          append-inner-icon="i-mdi-search"
          @click:append-inner="doFilter()"
        />
      </div>
    </template>
  </v-app-bar>
  <v-container fluid>
    <v-row no-gutters>
      <v-col cols="12" class="mb-3 text-center">
        Total: {{ toMoney(total) }}
      </v-col>
      <template v-for="row in searchResult">
        <v-col cols="12" class="text-caption">
          {{ formatDate(row.tDate) }}
        </v-col>
        <v-col cols="8" class="mb-3">
          {{ row.title }}
        </v-col>
        <v-col
          cols="4"
          :class="`${row.tCode === 'D' ? `text-red-darken-1` : `text-green-darken-1`} text-right mb-3`"
        >
          {{ toMoney(row.tCode === "D" ? row.amountOut : row.amountIn) }}
        </v-col>
      </template>
    </v-row>
  </v-container>
</template>
