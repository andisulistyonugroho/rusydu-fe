<script setup>
definePageMeta({
  layout: 'default',
  middleware: 'auth'
})

const { $debounce } = useNuxtApp()
const dayjs = useDayjs()
const startDate = dayjs().subtract(7, 'days')
const dNewRecord = ref(false)
const tDate = ref()
const days = []

for (let i = 1; i <= 37; i++) {
  const theDay = startDate.add(i, 'days')
  days.push({
    text: theDay.format('ddd, DD MMM YYYY')
  })
}

const addNew = $debounce((data) => {
  dNewRecord.value = true
  tDate.value = data.text
}, 1000, { leading: true, trailing: false })

const closeIt = () => {
  dNewRecord.value = false
  tDate.value = null
}

</script>
<template>
  <v-container fluid class="fill-height">
    <v-row no-gutters>
      <v-col v-for="row, i in days" cols="12">
        <v-card variant="plain" class="mt-1">
          <v-card-text>
            <v-row no-gutters>
              <v-col cols="12" class="font-weight-bold" @click="addNew(row)">
                {{ row.text }}
              </v-col>
              <template v-if="i === 10 || i === 4">
                <v-col cols="8" class="mt-2 mb-2">
                  Kredit
                </v-col>
                <v-col cols="4" class="mt-2 text-right mb-2">
                  10.000.000
                </v-col>
                <v-col cols="8">
                  Debit
                </v-col>
                <v-col cols="4" class="text-right mb-2">
                  1.000.000
                </v-col>
                <v-col cols="8">
                  Saldo
                </v-col>
                <v-col cols="4" class="text-right">
                  9.000.000
                </v-col>
              </template>
            </v-row>
          </v-card-text>
        </v-card>
        <v-divider></v-divider>
      </v-col>
    </v-row>
    <LazyAddDailyRecord :dialog="dNewRecord" :transactiondate="tDate" @closeit="closeIt" />
    <v-footer app class="bg-indigo-lighten-1 text-center d-flex flex-column">

      <div>
        Saldo: 10.000.00
      </div>
    </v-footer>
  </v-container>
</template>