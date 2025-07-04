<script setup lang="ts">
const emit = defineEmits(['dofilter', 'closeit'])

const payload = ref({
  title: ''
})
const form = ref()

const doFilter = async () => {
  const validate = await form.value.validate()
  if (!validate.valid) {
    return
  }
  emit('dofilter', payload.value)
}
</script>
<template>
  <v-card variant="flat">
    <v-toolbar dark color="primary" flat>
      <v-btn icon="i-mdi-close" dark @click="emit('closeit')" />
      <v-toolbar-title>Pencarian</v-toolbar-title>
    </v-toolbar>
    <v-card-text>
      <v-form ref="form">
        <v-text-field v-model="payload.title" label="Judul*" :rules="[(v) => !!v || 'Harus diisi']" variant="underlined"
          placeholder="beli bensin" persistent-placeholder clearable />
      </v-form>
    </v-card-text>
    <v-card-actions>
      <v-btn class="text-capitalize" block @click="doFilter()">cari</v-btn>
    </v-card-actions>
  </v-card>
</template>