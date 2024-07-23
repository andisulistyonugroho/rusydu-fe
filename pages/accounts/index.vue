<script setup>
const items = [
  {
    title: 'Item #1',
    value: 1,
    props: {
      to: '/asdf',
      appendIcon: 'mdi-chevron-right'
    }
  },
  {
    title: 'Item #2',
    value: 2,
  },
  {
    title: 'Item #3',
    value: 3,
  },
  {
    title: 'Item #4',
    value: 4,
  },
  {
    title: 'Item #5',
    value: 5,
  },
  {
    title: 'Item #6',
    value: 6,
  },
]
</script>
<template>
  <div>
    <v-list :items="items"></v-list>
    <div class="text-center">
      <v-btn>add new</v-btn>
    </div>
  </div>
</template>