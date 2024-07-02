<script setup>
const props = defineProps({
  dialog: { type: Boolean, default: false }
})
const emit = defineEmits(['closeit'])

const payload = ref({
  transactionType: 'C',
  amount: 0
})
</script>
<template>
  <v-dialog v-model="props.dialog">
    <v-card flat>
      <v-toolbar dark color="primary">
        <v-btn icon dark @click="emit('closeit')">
          <v-icon>mdi-close</v-icon>
        </v-btn>
        <v-toolbar-title>Pencatatan</v-toolbar-title>
      </v-toolbar>
      <v-card-text>
        <div class="text-center">2024/07/02</div>
        <v-radio-group v-model="payload.transactionType" inline class="px-5">
          <v-radio label="Kredit" value="C" />
          <v-radio label="Debit" value="D" />
          <v-radio label="Mutasi" value="M" />
        </v-radio-group>
        <v-text-field label="Title" variant="underlined" />
        <v-text-field v-model="payload.amount" :rules="[(v) => !!v || 'Required item']" label="Nominal"
          variant="underlined" type="number" />
        <v-select v-show="payload.transactionType === 'M' || payload.transactionType === 'D'" label="Akun Asal"
          :items="['CIMB', 'Dompet']" variant="underlined" />
        <v-select v-show="payload.transactionType === 'M' || payload.transactionType === 'C'" label="Akun Tujuan"
          :items="['CIMB', 'Dompet']" variant="underlined" />

        {{ payload }}
      </v-card-text>
      <v-card-actions>
        <v-btn variant="tonal" color="error">batal</v-btn>
        <v-btn variant="tonal" color="primary">simpan</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>