<script setup lang="ts">
const { hook, $pwa } = useNuxtApp();

const dialogWait = ref(false);
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
</script>
<template>
  <NuxtPwaManifest />
  <v-app>
    <v-main>
      <v-btn v-if="$pwa?.isPWAInstalled" @click="$pwa?.install()" class="ma-3"
        >install</v-btn
      >
      <slot />
      <v-progress-linear
        :active="dialogWait"
        :indeterminate="dialogWait"
        absolute
        bottom
        color="primary"
      ></v-progress-linear>
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
