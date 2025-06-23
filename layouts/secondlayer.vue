<script setup>
const { $bus } = useNuxtApp()
const { getTotalBalance } = useAccountStore()
const { totalBalance } = storeToRefs(useAccountStore())
const waitDialog = ref(false)
const title = ref('RUSDU')
const snacko = ref({
  message: null,
  color: null,
  open: false
})

onMounted(() => {
  $bus.$on('wait-dialog', (dialogValue) => {
    waitDialog.value = dialogValue
  })
  $bus.$on('eat-snackbar', (theSnack) => {
    snacko.value.color = theSnack instanceof Error ? 'error' : 'success'
    snacko.value.message = theSnack instanceof Error ? theSnack.response ? `${theSnack.response.data.error.statusCode}: ${theSnack.response.data.error.message}` : theSnack : theSnack
    snacko.value.open = true
  })
  $bus.$on('set-header', (val) => {
    title.value = val
  })
})

onBeforeUnmount(() => {
  $bus.$off('wait-dialog')
  $bus.$off('eat-snackbar')
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
