<script setup>
const menus = [
  {
    title: 'Buku Kas', link: '/cashbook', icon: 'i-mdi-book-account-outline', childs: [
      { title: null, link: null }
    ]
  },
  {
    title: 'Budgeting', icon: 'i-mdi-wallet-outline', link: '/budgeting', childs: [
      { title: null, link: null }
    ]
  },
  {
    title: 'Hutang',
    icon: 'i-mdi-account-cash-outline',
    link: '/debt',
    open: true
  },
  {
    title: 'Profile',
    icon: 'i-mdi-account-circle-outline',
    link: '/profile',
    open: true
  }
]
</script>
<template>
  <v-list nav>
    <v-list-item prepend-icon="i-mdi-home" title="Home" to="/"></v-list-item>
    <template v-for="parent in menus">
      <template v-if="parent.childs && parent.childs[0].title">
        <v-list-group class="firstlevel" :value="parent.title">
          <template v-slot:activator="{ props }">
            <v-list-item v-bind="props" :prepend-icon="parent.icon" :value="parent.title" :title="parent.title" />
          </template>

          <template v-for="child in parent.childs">
            <template v-if="child.childs[0].title">
              <v-list-group class="secondlevel" :value="child.title">
                <template v-slot:activator="{ props }">
                  <v-list-item v-bind="props" :prepend-icon="child.icon" :value="child.title"
                    :title="child.title"></v-list-item>
                </template>
                <v-list-item v-for="grandchild in child.childs" :value="grandchild.title" :title="grandchild.title"
                  :to="grandchild.link"></v-list-item>
              </v-list-group>
            </template>
            <v-list-item v-else :prepend-icon="child.icon" :value="child.title" :title="child.title"
              :to="child.link"></v-list-item>
          </template>
        </v-list-group>
      </template>
      <v-list-item v-else :prepend-icon="parent.icon" :title="parent.title" :to="parent.link" />
    </template>
  </v-list>
</template>