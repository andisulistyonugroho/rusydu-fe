<script setup>
const { $bus } = useNuxtApp()
definePageMeta({
  layout: 'secondlayer'
})
$bus.$emit('set-header', 'Buat Akun')
const data = ref({
  title: null,
  sBalance: 0,
  userId: null
})
const checkbox = ref(false)
const wa_number = ref()
</script>
<template>
  <v-container fluid>
    <v-row no-gutters>
      <v-col cols="12">
        <v-form ref="form" lazy-validation>
          <v-text-field v-model="data.title" :rules="[v => !!v || 'tidak boleh kosong']" variant="underlined"
            label="Nama Akun*" />
          <v-text-field v-model="data.sBalance" type="number" variant="underlined" label="Saldo Awal*" />
          <v-checkbox v-model="checkbox" :rules="[v => !!v || 'harus dicentang']" label="Semua data sudah sesuai" />
        </v-form>
        <div class="text-right">
          <v-btn>simpan</v-btn>
        </div>
      </v-col>
    </v-row>
  </v-container>


</template>