<script setup lang="ts">
const { $bus, $debounce } = useNuxtApp()
definePageMeta({
  layout: 'secondlayer',
  middleware: 'auth'
})
$bus.$emit('set-header', 'My Profile')
const { getUsername, changePassword, doLogout } = useProfileStore()
const { username } = storeToRefs(useProfileStore())
const { logout } = useAuthStore()

const form = ref()
const changeP = ref(false)
const tPassOld = ref(false)
const tPassNew = ref(false)
const tPassReNew = ref(false)

const oldPass = ref()
const newPass = ref()
const confnewPass = ref()
const checkbox = ref(false)

const doChangePassword = $debounce(async () => {
  try {
    $bus.$emit('wait-dialog', true)
    const validate = await form.value.validate()
    if (!validate.valid) {
      return
    }
    await changePassword(oldPass.value, newPass.value)
    logout()
    navigateTo('/')
    $bus.$emit('wait-dialog', false)
  } catch (error) {
    $bus.$emit('wait-dialog', false)
    $bus.$emit('eat-snackbar', error)
  }
}, 1000, { leading: true, trailing: false })

const loggingOut = (async () => {
  try {
    $bus.$emit('wait-dialog', true)
    await doLogout()
    logout()
    navigateTo('/')
    $bus.$emit('wait-dialog', false)
  } catch (error) {
    $bus.$emit('wait-dialog', false)
    $bus.$emit('eat-snackbar', error)
  }
})

getUsername()
</script>
<template>
  <v-container>
    <v-row>
      <template v-if="!changeP">
        <v-col cols="12">
          <v-text-field label="Username" v-model="username" :placeholder="username" persistent-placeholder readonly />
        </v-col>
        <v-col cols="12" class="text-center">
          <v-btn variant="tonal" block @click="changeP = true">ganti password</v-btn>
          <v-btn color="error" block class="mt-3" @click="loggingOut()">logout</v-btn>
        </v-col>
      </template>
      <template v-else>
        <v-col cols="12">
          <v-form ref="form">
            <v-text-field v-model="oldPass" label="Password Lama" clearable :type="tPassOld ? 'text' : 'password'"
              :append-inner-icon="tPassOld ? 'i-mdi-eye' : 'i-mdi-eye-off'" :rules="[(v) => !!v || 'Harus diisi']"
              @click:append-inner="tPassOld = !tPassOld" />
            <v-text-field v-model="newPass" label="Password Baru" clearable :type="tPassNew ? 'text' : 'password'"
              :append-inner-icon="tPassNew ? 'i-mdi-eye' : 'i-mdi-eye-off'" :rules="[
                (v) => !!v || 'Harus diisi',
                (v) => v.length > 5 || 'Min 5 karakter'
              ]" @click:append-inner="tPassNew = !tPassNew" />
            <v-text-field v-model="confnewPass" label="Konfirmasi Password Baru" clearable
              :type="tPassReNew ? 'text' : 'password'" :append-inner-icon="tPassReNew ? 'i-mdi-eye' : 'i-mdi-eye-off'"
              :rules="[
                (v) => !!v || 'Harus diisi',
                (v) => v === newPass || 'Password tidak sama',
                (v) => v.length > 5 || 'Min 5 karakter'
              ]" @click:append-inner="tPassReNew = !tPassReNew" />
            <v-checkbox v-model="checkbox" :rules="[v => !!v || 'checkbox required']" label="Lanjutkan"></v-checkbox>
          </v-form>
        </v-col>
        <v-col cols="12">
          <div class="d-flex justify-space-between">
            <v-btn variant="tonal" @click="changeP = false">batal</v-btn>
            <v-btn color="error" variant="tonal" @click="doChangePassword()">ganti password</v-btn>
          </div>
        </v-col>
      </template>
    </v-row>
  </v-container>
</template>