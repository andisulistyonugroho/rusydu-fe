<script setup lang="ts">
const { $bus, $debounce } = useNuxtApp()
definePageMeta({
  layout: 'secondlayer',
  middleware: 'auth'
})
$bus.$emit('set-header', 'My Profile')
const { getUsername } = useProfileStore()
const { username } = storeToRefs(useProfileStore())

const changeP = ref(false)
const tOPass = ref(false)

getUsername()
</script>
<template>
  <v-container>
    <v-row>
      <v-col cols="12">
        <v-text-field v-if="!changeP" label="Username" v-model="username" :placeholder="username" persistent-placeholder
          readonly />
        <template v-else>
          <v-text-field label="Password Lama" clearable :type="tOPass ? 'text' : 'password'"
            :append-inner-icon="tOPass ? 'i-mdi-eye' : 'i-mdi-eye-off'" @click:append-inner="tOPass = !tOPass" />
          <v-text-field label="Password Baru" clearable />
          <v-text-field label="Ulangi Password Baru" clearable />
        </template>
      </v-col>
      <v-col cols="12" class="text-center">
        <v-btn @click="changeP = !changeP">ganti password</v-btn>
      </v-col>
    </v-row>
  </v-container>
</template>