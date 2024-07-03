<script setup>
const snacko = ref({
  message: null,
  color: null,
  open: false
})
</script>
<template>
  <v-app>
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
