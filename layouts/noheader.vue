<script setup lang="ts">
const { $bus } = useNuxtApp()

const waitDialog = ref(false)
const drawer = ref(false)
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
  $bus.$on('open-drawer', () => {
    drawer.value = !drawer.value
  })
})

onBeforeUnmount(() => {
  $bus.$off('wait-dialog')
  $bus.$off('error-snackbar')
  $bus.$off('success-snackbar')
  $bus.$off('open-drawer')
})
</script>
<template>
  <NuxtPwaManifest />
  <v-app>
    <v-navigation-drawer v-model="drawer">
      <LazyTheMenu />
    </v-navigation-drawer>

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
