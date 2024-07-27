<script setup>
definePageMeta({
  layout: 'empty',
  middleware: 'auth'
})
const { $debounce, $bus, $api } = useNuxtApp()
const route = useRoute()
const { setUser } = useAuthStore()

const action = route.query.action
const passType = ref(true)
const loginF = ref()
const regisF = ref()
const payload = ref({
  email: null,
  wa_number: null,
  password: null
})
const tab = ref(1)
const checkbox = ref(false)
if (action === 'regis') {
  tab.value = 2
}

const doSubmit = $debounce(async () => {
  try {
    if (tab.value === 1) {
      const validate = await loginF.value.validate()
      if (!validate.valid) {
        return true
      }
      $bus.$emit('wait-dialog', true)
      await doLogin()
      navigateTo('/', { replace: true })
    } else if (tab.value === 2) {
      const validate = await regisF.value.validate()
      if (!validate.valid) {
        return true
      }
      $bus.$emit('wait-dialog', true)
      await doRegis()
      await doLogin()
      navigateTo('/', { replace: true })
    }
    $bus.$emit('wait-dialog', false)
  } catch (error) {
    $bus.$emit('wait-dialog', false)
    $bus.$emit('eat-snackbar', error)
  }
}, 1000, { leading: true, trailing: false })

const doRegis = (async () => {
  try {
    payload.value.username = payload.value.wa_number
    const { data } = await $api.post('/Users', {
      realm: 'member',
      username: payload.value.wa_number,
      email: payload.value.email,
      password: payload.value.password
    })
    return Promise.resolve(data)
  } catch (error) {
    return Promise.reject(error)
  }
})

const doLogin = (async () => {
  try {
    const { data } = await $api.post('/Users/login', {
      username: `member:${payload.value.wa_number}`,
      password: payload.value.password
    })
    setUser({ token: data.id, userId: data.userId })
    return Promise.resolve()
  } catch (error) {
    return Promise.reject(error)
  }
})
</script>
<template>
  <v-container>
    <v-row style="height:100vh;">
      <v-col align-self="start" cols="12" md="4" offset-md="4">
        <div class="text-center ma-12">
          <h1>Rusydu</h1>
          <div class="text-caption">Jaga dan kelola hartamu</div>
        </div>
      </v-col>
      <v-col align-self="end" cols="12" md="4" offset-md="4" class="mb-3">
        <v-tabs v-model="tab" fixed-tabs class="mb-3">
          <v-tab size="large" variant="plain" :value="1" rounded="0">
            masuk
          </v-tab>
          <v-tab size="large" variant="plain" :value="2" rounded="0">
            buat akun
          </v-tab>
        </v-tabs>
        <v-window v-model="tab">
          <v-window-item :value="1">
            <v-form ref="loginF" lazy-validation>
              <v-text-field v-model="payload.wa_number" :rules="[v => !!v || 'item required']" rounded="lg"
                variant="underlined" label="No WA*" clearable type="number" />
              <v-text-field v-model="payload.password" :rules="[v => !!v || 'item required']" rounded="lg"
                variant="underlined" label="Password*" :append-inner-icon="passType ? 'mdi-eye-off' : 'mdi-eye'"
                :type="passType ? 'password' : 'text'" @click:append-inner="passType = !passType" clearable />
            </v-form>
          </v-window-item>
          <v-window-item :value="2">
            <v-form ref="regisF" lazy-validation>
              <v-text-field v-model="payload.wa_number" :rules="[v => !!v || 'item required']" rounded="lg"
                variant="underlined" label="No WA*" clearable type="number" />
              <v-text-field v-model="payload.email" :rules="[
                v => !!v || 'item required',
                v => /.+@.+\..+/.test(v) || 'E-mail not valid'
              ]" rounded="lg" variant="underlined" label="Email*" clearable />
              <v-text-field v-model="payload.password" :rules="[v => !!v || 'item required']" rounded="lg"
                variant="underlined" label="Password*" :append-inner-icon="passType ? 'mdi-eye-off' : 'mdi-eye'"
                :type="passType ? 'password' : 'text'" @click:append-inner="passType = !passType" clearable />
              <v-checkbox v-model="checkbox" :rules="[v => !!v || 'checkbox required']"
                label="Password sudah saya simpan di tempat yang aman"></v-checkbox>
            </v-form>
          </v-window-item>
        </v-window>
        <v-btn size="large" rounded="lg" block variant="tonal" class="text-capitalize" @click="doSubmit">
          Submit&nbsp;
        </v-btn>
      </v-col>
    </v-row>
  </v-container>
</template>