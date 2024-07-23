<script setup>
definePageMeta({
  layout: 'secondlayer'
})
</script>
<template>
  <v-container fluid>
    <v-row no-gutters>
      <v-col cols="12">
        <v-form>
          <v-text-field variant="underlined" label="Nama Akun*"></v-text-field>
          <v-text-field variant="underlined" label="Saldo Awal*"></v-text-field>
        </v-form>
        <div class="text-right">
          <v-btn>simpan</v-btn>
        </div>
      </v-col>
    </v-row>
  </v-container>


</template>