<script setup lang="ts">
const { hook } = useNuxtApp();
const { getTotalBalance } = useAccountStore();
const { totalBalance } = storeToRefs(useAccountStore());
const dialogWait = ref(false);
const title = ref("RUSDU");

const snacko = ref({
  message: "",
  color: "error",
  open: false,
});

hook("snackIt", (error: unknown) => {
  alert("error:" + error);
  let msg = "";
  let color = "success";
  if (error instanceof Error) {
    msg = "unknown error";
    color = "error";
    if (typeof error === "object" && error !== null) {
      const err: any = error;
      if (err.response && err.response.data && err.response.data.error) {
        msg = err.response.data.error.message;
      } else if (err.message) {
        msg = err.message;
      }
    }
  } else if (typeof error === "string") {
    msg = error;
    color = "success";
  }

  snacko.value = {
    message: msg,
    color: color,
    open: true,
  };
});
hook("waitDialog", (open: boolean) => {
  dialogWait.value = open;
});
hook("setHeader", (theTitle: string) => {
  title.value = theTitle;
});

getTotalBalance();
</script>
<template>
  <NuxtPwaManifest />
  <v-app>
    <v-progress-linear
      :active="dialogWait"
      :indeterminate="dialogWait"
      absolute
      bottom
      color="primary"
    ></v-progress-linear>
    <v-app-bar extended class="border-b">
      <v-btn icon="i-mdi-arrow-left" @click="$router.go(-1)" />
      <v-app-bar-title>{{ title }}</v-app-bar-title>
      <template v-slot:extension>
        <div class="w-100 text-center font-weight-bold">
          Saldo: {{ toMoney(totalBalance) }}
        </div>
      </template>
    </v-app-bar>

    <v-main>
      <slot />
    </v-main>

    <v-snackbar v-model="snacko.open" :color="snacko.color" multi-line>
      {{ snacko.message }}

      <template v-slot:actions>
        <v-btn
          :color="snacko.color"
          variant="text"
          @click="snacko.open = false"
        >
          Close
        </v-btn>
      </template>
    </v-snackbar>
  </v-app>
</template>
