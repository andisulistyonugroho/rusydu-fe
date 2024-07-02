<script setup>
const waitDialog = ref(false)
const snacko = ref({
  message: null,
  color: null,
  open: false
})
</script>
<template>
  <v-app>
    <v-app-bar app class="border-b">
      <v-container fluid>
        <!-- <v-toolbar-title> -->
        <div class="d-flex justify-space-between">
          <div>
            <!-- <v-btn icon height="24" @click="theme.global.name.value = theme.global.current.value.dark ? 'light' : 'dark'"> -->
            <!-- <v-icon @click="">mdi-theme-light-dark</v-icon> -->
            <!-- </v-btn> -->
          </div>
        </div>

        <!-- </v-toolbar-title> -->
      </v-container>
      <v-progress-linear :active="waitDialog" :indeterminate="waitDialog" absolute bottom
        color="primary"></v-progress-linear>
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
