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
    <v-navigation-drawer v-model="drawer">
      <LazyTheMenu />
    </v-navigation-drawer>
    <v-app-bar class="border-b">
      <v-app-bar-nav-icon @click="drawer = !drawer"></v-app-bar-nav-icon>

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
