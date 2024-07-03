<script setup>
definePageMeta({
  layout: 'empty'
})
const route = useRoute()
const action = route.query.action
const passType = ref(true)
const loginF = ref()
const regisF = ref()
const payload = ref({
  username: null,
  wa_number: null,
  password: null
})
const tab = ref(1)
const checkbox = ref(false)
if (action === 'login') {
  tab.value = 1
} else {
  tab.value = 2
}

const doSubmit = useDebounce(async () => {
  try {
    if (tab.value === 1) {
      const validate = await loginF.value.validate()
      if (!validate.valid) {
        return true
      }
      $bus.$emit('wait-dialog', true)
      await doLogin()
    } else if (tab.value === 2) {
      const validate = await regisF.value.validate()
      if (!validate.valid) {
        return true
      }
      $bus.$emit('wait-dialog', true)
      await doRegis()
      await doLogin()
    }
    $bus.$emit('wait-dialog', false)
    router.replace('/themes')
  } catch (error) {

    $bus.$emit('wait-dialog', false)
    $bus.$emit('eat-snackbar', error)
  }

}, 1000, { leading: true, trailing: false })

const doRegis = (async () => {
  try {
    payload.value.realm = 'member'
    payload.value.email = `${payload.value.wa_number}@catet.in`
    payload.value.emailVerified = true
    const { data } = await register(payload.value)
    return Promise.resolve(data)
  } catch (error) {
    return Promise.reject(error)
  }
})

const doLogin = (async () => {
  try {
    const data = await login(
      `${payload.value.wa_number}@catet.in`,
      payload.value.password
    )
    setUser({ token: data.id, userId: data.userId })
    return Promise.resolve()
  } catch (error) {
    return Promise.reject(error)
  }
})
</script>
<template>
  <v-container class="fill-height">
    <v-row>
      <v-col cols="12" md="4" offset-md="4">
        <v-card variant="tonal" color="primary" class="pt-5 pb-5" rounded="xl">
          <v-tabs v-model="tab" fixed-tabs>
            <v-tab size="large" variant="plain" :value="1">
              masuk
            </v-tab>
            <v-tab size="large" variant="plain" :value="2">
              buat akun
            </v-tab>
          </v-tabs>
          <v-card-item class="pt-10">
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
                  <v-text-field v-model="payload.username" :rules="[v => !!v || 'item required']" rounded="lg"
                    variant="underlined" label="Username*" clearable />
                  <v-text-field v-model="payload.password" :rules="[v => !!v || 'item required']" rounded="lg"
                    variant="underlined" label="Password*" :append-inner-icon="passType ? 'mdi-eye-off' : 'mdi-eye'"
                    :type="passType ? 'password' : 'text'" @click:append-inner="passType = !passType" clearable />
                  <v-checkbox v-model="checkbox" :rules="[v => !!v || 'checkbox required']"
                    label="Username &amp; Password sudah saya simpan di tempat yang aman"></v-checkbox>
                </v-form>
              </v-window-item>
            </v-window>
          </v-card-item>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn size="large" rounded="lg" block variant="tonal" class="text-capitalize" @click="doSubmit">
              Submit&nbsp;
              <v-icon right>mdi-login</v-icon>
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-col>
      <v-col cols="12" class="text-center">
        <v-chip color="primary" variant="text" to="/">Kembali ke home</v-chip>
      </v-col>
    </v-row>
  </v-container>
</template>