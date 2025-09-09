<script setup lang="ts">
definePageMeta({
  layout: "secondlayer",
  middleware: "auth",
});

const { callHook, $debounce, $dayjs, $router } = useNuxtApp();
const { addMyBudget, getBudgetInPeriod } = useBudgetingStore();
const { budgets } = storeToRefs(useBudgetingStore());
const route = useRoute();

const thePeriod = route.query.theperiod;
callHook("waitDialog", "Salin Budget");
const months = [
  { title: "Januari", value: "01" },
  { title: "Pebruari", value: "02" },
  { title: "Maret", value: "03" },
  { title: "April", value: "04" },
  { title: "Mei", value: "05" },
  { title: "Juni", value: "06" },
  { title: "Juli", value: "07" },
  { title: "Agustus", value: "08" },
  { title: "September", value: "09" },
  { title: "Oktober", value: " 10" },
  { title: "Nopember", value: "11" },
  { title: "Desember", value: "12" },
];
const checkbox = ref(false);
const form = ref();
const yearfrom = ref($dayjs().subtract(1, "month").format("YYYY"));
const monthfrom = ref($dayjs().subtract(1, "month").format("MM"));
const year = ref($dayjs().format("YYYY"));
const month = ref($dayjs().format("MM"));
const selectedBudget = ref<number[]>([]);
const selectAll = ref(false);

watch(selectAll, (v) => {
  if (v === true) {
    selectedBudget.value = budgets.value.map((obj) => obj.id);
  } else if (v === false) {
    selectedBudget.value = [];
  }
});

if (thePeriod) {
  year.value = $dayjs(thePeriod.toString()).format("YYYY");
  month.value = $dayjs(thePeriod.toString()).format("MM");
}

const years = computed(() => {
  const result: string[] = [];
  const y = parseInt($dayjs().format("YYYY"));
  for (let year = 2023; year < y; year++) {
    const nextYear = year + 1;
    result.push(nextYear.toString());
  }
  return result;
});
const periode = computed(() => {
  return `${year.value}-${month.value}-01 00:00:00`;
});

const doSubmit = $debounce(
  async () => {
    try {
      const validate = await form.value.validate();
      if (!validate.valid || selectedBudget.value.length <= 0) {
        return;
      }
      callHook("waitDialog", true);

      const data = budgets.value.filter((obj) =>
        selectedBudget.value.includes(obj.id),
      );

      for (let i = 0; i < data.length; i++) {
        const row = data[i];
        const payload = {
          title: row.title,
          thePeriod: periode.value,
          amount: row.amount,
        };
        await addMyBudget(payload);
      }
      $router.back();
      callHook("waitDialog", false);
      callHook("snackIt", "Budget berhasil disimpan");
    } catch (error) {
      callHook("waitDialog", false);
      callHook("snackIt", error);
    }
  },
  1000,
  { leading: true, trailing: false },
);

const getBudget = $debounce(
  async () => {
    try {
      callHook("waitDialog", true);
      const period = `${yearfrom.value}-${monthfrom.value}-01 00:00:00`;
      await getBudgetInPeriod(period);
      callHook("waitDialog", false);
    } catch (error) {
      callHook("waitDialog", false);
      callHook("snackIt", error);
    }
  },
  1000,
  { leading: true, trailing: false },
);
</script>
<template>
  <v-container fluid>
    <v-row no-gutters>
      <v-col cols="12">
        <v-form ref="form" lazy-validation>
          <v-row no-gutters>
            <v-col cols="12" class="text-tiny">Sumber</v-col>
            <v-col cols="6">
              <v-select
                v-model="yearfrom"
                :items="years"
                label="Tahun"
                variant="underlined"
              />
            </v-col>
            <v-col cols="6">
              <v-select
                v-model="monthfrom"
                label="Bulan"
                :items="months"
                variant="underlined"
              />
            </v-col>
            <v-col cols="12">
              <v-btn variant="tonal" @click="getBudget()" block>lihat</v-btn>
            </v-col>
            <v-col cols="12">
              <v-checkbox-btn
                v-if="budgets.length"
                v-model="selectAll"
                label="Pilih Semua"
                class="pt-5"
              />
              <v-list>
                <v-list-item v-for="row in budgets" :title="row.title">
                  <template v-slot:prepend="isActive">
                    <v-list-item-action start>
                      <v-checkbox-btn
                        :value="row.id"
                        v-model="selectedBudget"
                      ></v-checkbox-btn>
                    </v-list-item-action>
                  </template>

                  <v-list-item-subtitle>
                    {{ toMoney(row.amount) }}
                  </v-list-item-subtitle>
                </v-list-item>
              </v-list>
            </v-col>
            <v-col v-if="selectedBudget.length" cols="12" class="text-tiny"
              >Tujuan</v-col
            >
            <v-col v-if="selectedBudget.length" cols="6">
              <v-select
                v-model="year"
                :items="years"
                label="Tahun"
                variant="underlined"
              />
            </v-col>
            <v-col v-if="selectedBudget.length" cols="6">
              <v-select
                v-model="month"
                label="Bulan"
                :items="months"
                variant="underlined"
              />
            </v-col>
            <v-col v-if="selectedBudget.length" cols="12">
              <v-checkbox
                v-model="checkbox"
                :rules="[(v) => !!v || 'harus dicentang']"
                label="Semua data sudah sesuai"
              />
            </v-col>
          </v-row>
        </v-form>
        <div v-if="selectedBudget.length" class="text-right">
          <v-btn variant="tonal" @click="doSubmit()">simpan</v-btn>
        </div>
      </v-col>
    </v-row>
  </v-container>
</template>
