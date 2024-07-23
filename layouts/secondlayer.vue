<script setup>
const waitDialog = ref(false)
const drawer = ref(false)
const snacko = ref({
  message: null,
  color: null,
  open: false,
})
</script>
<template>
  <v-app>
    <v-app-bar class="border-b">
      <v-btn icon @click="$router.go(-1)"><v-icon>mdi-arrow-left</v-icon></v-btn>
      <v-app-bar-title>Rusydu</v-app-bar-title>
    </v-app-bar>

    <v-main>
      <slot />
    </v-main>

    <v-snackbar v-model="snacko.open" :color="snacko.color" multi-line>
      {{ snacko.message }}

      <template v-slot:actions>
        <v-btn :color="snacko.color" variant="text" @click="snacko.open = false">
          Close
        </v-btn>
      </template>
    </v-snackbar>
  </v-app>
</template>
