<script setup>
const { $bus } = useNuxtApp()

const waitDialog = ref(false)
const drawer = ref(false)
const snacko = ref({
  message: null,
  color: null,
  open: false,
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
  $bus.$on('open-drawer', () => {
    drawer.value = !drawer.value
  })
})
onBeforeUnmount(() => {
  $bus.$off('wait-dialog')
  $bus.$off('eat-snackbar')
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
