<script setup lang="ts">
const { $bus } = useNuxtApp()

const waitDialog = ref(false)

const snacko = ref({
  message: '',
  color: 'error',
  open: false,
})

onMounted(() => {
  $bus.$on('wait-dialog', (dialog: boolean) => {
    waitDialog.value = dialog
  })
  $bus.$on('error-snackbar', (error: unknown) => {
    let message = 'unknown error'

    if (typeof error === 'object' && error !== null) {
      const err: any = error
      if (err.response && err.response.data && err.response.data.error) {
        message = err.response.data.error.message
      } else if (err.message) {
        message = err.message
      }
    }

    snacko.value.message = message
    snacko.value.open = true
  })
  $bus.$on('success-snackbar', (message: string) => {
    snacko.value.color = 'success'
    snacko.value.message = message
    snacko.value.open = true
  })
})

onBeforeUnmount(() => {
  $bus.$off('wait-dialog')
  $bus.$off('error-snackbar')
  $bus.$off('success-snackbar')
})
</script>
<template>
  <NuxtPwaManifest />
  <v-app>
    <v-main>
      <slot />
      <v-progress-linear :active="waitDialog" :indeterminate="waitDialog" absolute bottom
        color="primary"></v-progress-linear>
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
