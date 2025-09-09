<script setup lang="ts">
import type { MaskInputOptions } from "maska";
const { $debounce, callHook } = useNuxtApp();

const props = defineProps({
  transactiondate: { type: String, default: "" },
  hinttext: { type: String, default: "" },
});

const emit = defineEmits(["savesuccess"]);

const { accounts } = storeToRefs(useAccountStore());
const { addDebt, getParents } = useDebtStore();
const { parents } = storeToRefs(useDebtStore());

const payload = ref<NewDebt>({
  title: "",
  amount: 0,
  debtType: "bill",
  tDate: props.transactiondate,
  toFinancialAccountId: null,
  parentId: null,
});
const form = ref();
const loading = ref(false);
const options = reactive<MaskInputOptions>({
  number: { locale: "id" },
  onMaska: (detail) => {
    payload.value.amount = parseFloat(detail.unmasked);
  },
});

const doSave = $debounce(
  async () => {
    try {
      const validate = await form.value.validate();
      if (!validate.valid) {
        return;
      }

      loading.value = true;
      await addDebt(payload.value);
      loading.value = false;

      callHook("snackIt", "Berhasil disimpan");
      emit("savesuccess");
    } catch (error) {}
  },
  1000,
  { leading: true, trailing: false },
);

getParents();
</script>
<template>
  <v-card flat rounded="t-0 b-lg">
    <v-card-text>
      <div class="text-center text-h6">{{ props.transactiondate }}</div>
      <div class="text-center pb-2">
        {{ hinttext }}
      </div>
      <v-form ref="form">
        <v-radio-group
          v-model="payload.debtType"
          inline
          :rules="[(v) => !!v || 'Harus diisi']"
          class="mt-6"
        >
          <template v-slot:label>
            <div>Jenis hutang</div>
          </template>
          <v-radio label="Tagihan" value="bill" />
          <v-radio label="Modal" value="capital" />
        </v-radio-group>
        <v-text-field
          v-model="payload.title"
          label="Title"
          :rules="[(v) => !!v || 'Harus diisi']"
          variant="underlined"
          placeholder="Pembelian bensin"
          persistent-placeholder
          clearable
        />
        <v-text-field
          prefix="Rp"
          v-maska="options"
          :rules="[(v) => !!v || 'Harus diisi']"
          label="Nominal"
          variant="underlined"
          clearable
          placeholder="0"
          persistent-placeholder
        />
        <v-select
          label="Induk"
          v-model="payload.parentId"
          :items="parents"
          item-value="id"
          variant="underlined"
        ></v-select>
        <v-select
          v-if="payload.debtType === 'capital'"
          v-model="payload.toFinancialAccountId"
          label="Akun Tujuan"
          :items="accounts"
          item-value="id"
          variant="underlined"
        />
      </v-form>
    </v-card-text>
    <v-card-actions>
      <v-btn
        color="error"
        variant="tonal"
        @click="form.reset()"
        :loading="loading"
        >batal</v-btn
      >
      <v-btn
        color="primary"
        variant="tonal"
        @click="doSave()"
        :loading="loading"
        >simpan</v-btn
      >
    </v-card-actions>
  </v-card>
</template>
