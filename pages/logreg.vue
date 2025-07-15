<script setup lang="ts">
const config = useRuntimeConfig()
definePageMeta({
  layout: 'empty',
  middleware: 'auth'
})
const { $debounce, $bus, $api, $pwa, $device } = useNuxtApp()
const route = useRoute()
const { setUser } = useAuthStore()

const onWeb = ref(false)
const instalationManualIOS = ref(false)
const action = route.query.action
const passType = ref(true)
const loginF = ref()
const regisF = ref()
const payload = ref({
  email: '',
  wa_number: '',
  password: ''
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
    $bus.$emit('error-snackbar', error)
  }
}, 1000, { leading: true, trailing: false })

const doRegis = (async () => {
  try {
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

const doInstall = () => {
  onWeb.value = false
  if ($device.isIos) {
    instalationManualIOS.value = true
  } else {
    $pwa?.install()
  }
}
</script>
<template>
  <v-container>
    <v-row style="height:100vh;">
      <v-col align-self="start" cols="12" md="4" offset-md="4">
        <div class="text-center ma-12">
          <div class="text-h2">Rusdu</div>
          <div class="text-caption">Jaga Harta Kelola Dunia</div>
        </div>
      </v-col>
      <v-col v-if="onWeb || $pwa?.isPWAInstalled" align-self="end" cols="12" md="4" offset-md="4" class="mb-3">
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
                variant="underlined" label="Password*" :append-inner-icon="passType ? 'i-mdi-eye-off' : 'i-mdi-eye'"
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
      <v-col v-if="instalationManualIOS" cols="12" md="6" offset-md="3">
        <div class="px-10">
          Step by step instalasi di iOS
          <ol>
            <li>Buka halaman website ini melalui browser Safari.</li>
            <li>Buka menu berbagi:<br>Tap ikon "Bagikan" yang terletak di bagian bawah layar (berbentuk persegi dengan
              panah ke
              atas).</li>
            <li>Pilih "Tambahkan ke Layar Utama":<br>Di menu berbagi, scroll ke bawah dan pilih opsi "Tambahkan ke Layar
              Utama".
            </li>
            <li>Konfirmasi dan tambahkan:<br>Tap tombol "Tambahkan" di pojok kanan atas untuk menyelesaikan instalasi di
              iOS.</li>
          </ol>
        </div>
      </v-col>
      <v-col cols="12" class="text-center text-caption">
        <template v-if="!$pwa?.isPWAInstalled">
          <v-btn block @click="doInstall()">install</v-btn>
          <v-btn block @click="onWeb = true; instalationManualIOS = false;" class="mt-3">tetap di web</v-btn>
        </template>
        <div>
          version:{{ config.public.theVersion }}
        </div>
      </v-col>
    </v-row>
  </v-container>
</template>