<script setup lang="ts">
interface Menu {
  title: string;
  link: string;
  icon: string;
  childs?: Menu[];
}
const menus: Menu[] = [
  {
    title: "Buku Kas",
    link: "/cashbook",
    icon: "i-mdi-book-account-outline",
  },
  {
    title: "Budget Plan",
    icon: "i-mdi-wallet-outline",
    link: "/budgeting",
  },
  {
    title: "Hutang",
    icon: "i-mdi-account-cash-outline",
    link: "/debt",
  },
  {
    title: "Laporan",
    icon: "i-mdi-receipt-text-clock-outline",
    link: "/report",
  },
  {
    title: "Profile",
    icon: "i-mdi-account-circle-outline",
    link: "/profile",
  },
];
</script>
<template>
  <v-list nav>
    <v-list-item prepend-icon="i-mdi-home" title="Home" to="/"></v-list-item>
    <template v-for="parent in menus">
      <template v-if="parent.childs">
        <v-list-group class="firstlevel" :value="parent.title">
          <template v-slot:activator="{ props }">
            <v-list-item
              v-bind="props"
              :prepend-icon="parent.icon"
              :value="parent.title"
              :title="parent.title"
            />
          </template>

          <template v-for="child in parent.childs">
            <template v-if="child.childs">
              <v-list-group class="secondlevel" :value="child.title">
                <template v-slot:activator="{ props }">
                  <v-list-item
                    v-bind="props"
                    :prepend-icon="child.icon"
                    :value="child.title"
                    :title="child.title"
                  ></v-list-item>
                </template>
                <v-list-item
                  v-for="grandchild in child.childs"
                  :value="grandchild.title"
                  :title="grandchild.title"
                  :to="grandchild.link"
                ></v-list-item>
              </v-list-group>
            </template>
            <v-list-item
              v-else
              :prepend-icon="child.icon"
              :value="child.title"
              :title="child.title"
              :to="child.link"
            ></v-list-item>
          </template>
        </v-list-group>
      </template>
      <v-list-item
        v-else
        :prepend-icon="parent.icon"
        :title="parent.title"
        :to="parent.link"
      />
    </template>
  </v-list>
</template>
