<script setup lang="ts">
const { $bus } = useNuxtApp()
const { getTotalBalance } = useAccountStore()
const { totalBalance } = storeToRefs(useAccountStore())
const waitDialog = ref(false)
const title = ref('RUSDU')

const snacko = ref({
  message: '',
  color: 'error',
  open: false,
})

onBeforeMount(() => {
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
  $bus.$on('set-header', (val: string) => {
    title.value = val
  })
})

onBeforeUnmount(() => {
  $bus.$off('wait-dialog')
  $bus.$off('error-snackbar')
  $bus.$off('success-snackbar')
  $bus.$off('set-header')
})

getTotalBalance()
</script>
<template>
  <NuxtPwaManifest />
  <v-app>
    <v-app-bar extended class="border-b">
      <v-btn icon @click="$router.go(-1)"><v-icon>i-mdi-arrow-left</v-icon></v-btn>
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
        <v-btn :color="snacko.color" variant="text" @click="snacko.open = false">
          Close
        </v-btn>
      </template>
    </v-snackbar>
  </v-app>
</template>
