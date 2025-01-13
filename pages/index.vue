<script setup>
definePageMeta({
  layout: 'noheader',
  middleware: 'auth'
})

const { $debounce, $bus } = useNuxtApp()
const { getTotalBalance } = useAccountStore()
const { getRecordInBetween } = useRecordStore()
const { accounts, totalBalance } = storeToRefs(useAccountStore())
const { transactionLog } = storeToRefs(useRecordStore())

const dayjs = useDayjs()
const startDate = ref(dayjs().startOf('day'))
const dNewRecord = ref(false)
const tDate = ref()
const days = ref([])
const numOfDays = 8
const notif = ref(false)
const tlog = ref([])
const startIndex = ref(0)

const addNew = $debounce((data) => {
  dNewRecord.value = true
  tDate.value = data.text
}, 1000, { leading: true, trailing: false })

const closeIt = () => {
  dNewRecord.value = false
  tDate.value = null
}

await getRecordInBetween({
  startDate: startDate.value.subtract(numOfDays, 'days').format('YYYY-MM-DD 17:00:00'),
  endDate: startDate.value.subtract(7, 'hours').format('YYYY-MM-DD 16:59:59')
})

await getTotalBalance()

const generateCalendar = (position) => {
  tlog.value = JSON.parse(JSON.stringify(transactionLog.value))
  const backdate = []
  for (let i = 1; i <= numOfDays; i++) {
    const theDay = startDate.value.subtract(i, 'days')
    const logs = showLogs(theDay.format('YYYY-MM-DD'))

    if (position === 'start') {
      backdate.push({
        id: theDay.format('YYYYMMDD'),
        text: theDay.format('ddd, DD MMM YYYY'),
        logs: logs.list,
        totalIn: logs.totalIn,
        totalOut: logs.totalOut
      })
    } else {
      days.value.push({
        id: theDay.format('YYYYMMDD'),
        text: theDay.format('ddd, DD MMM YYYY'),
        logs: logs.list,
        totalIn: logs.totalIn,
        totalOut: logs.totalOut
      })
    }
  }
  if (backdate.length > 0) {
    days.value.unshift(...backdate)
  }
}

const showLogs = (theDate) => {
  const logs = tlog.value.filter((obj) => dayjs(obj.tDate).format('YYYY-MM-DD') === theDate)
  const totalIn = logs.reduce((total, obj) => (
    total + obj.amountIn
  ), 0)
  const totalOut = logs.reduce((total, obj) => (
    total + obj.amountOut
  ), 0)
  const logS = []

  for (let i = startIndex.value; i < tlog.value.length; i++) {
    const obj = tlog.value[i]
    const found = theDate === dayjs(obj.tDate).format('YYYY-MM-DD')
    if (found) {
      logS.push(obj)
      startIndex.value = i + 1
    }
  }

  return { list: logs, totalIn: totalIn, totalOut: totalOut }
}

const refreshParent = (async () => {
  startDate.value = dayjs().subtract(8, 'days').startOf('day')
  await getRecordInBetween({
    startDate: startDate.value.subtract(7, 'hours').format('YYYY-MM-DD HH:mm:ss'),
    endDate: startDate.value.add(numOfDays, 'days').format('YYYY-MM-DD 16:59:59')
  })
  days.value = []
  generateCalendar()
})

const onScroll = $debounce(async () => {
  const ih = window.innerHeight
  const ls = document.getElementById('loader-skeleton')
  let rect = ls.getBoundingClientRect()
  const posy = rect.height + rect.y

  if (dNewRecord.value || posy > ih) {
    return
  }

  if (posy <= ih) {
    // alert('do get older data')
    startDate.value = startDate.value.subtract(numOfDays, 'days').startOf('date')
    await getRecordInBetween({
      startDate: startDate.value.subtract(numOfDays, 'days').format('YYYY-MM-DD 17:00:00'),
      endDate: startDate.value.subtract(7, 'hours').format('YYYY-MM-DD 16:59:59')
    })
    generateCalendar()
  }
}, 1000, { leading: false, trailing: true })

onMounted(() => {
  if (accounts.value.length === 0) {
    notif.value = true
  }
  days.value = []
  generateCalendar()

  document.addEventListener("scroll", onScroll)
})

onBeforeUnmount(() => {
  document.removeEventListener("scroll", onScroll)
})

</script>
<template>
  <v-app-bar extended class="border-b bg-primary">
    <v-app-bar-nav-icon @click="$bus.$emit('open-drawer')"></v-app-bar-nav-icon>
    <v-app-bar-title>Buku Kas</v-app-bar-title>
    <v-btn icon="i-mdi-plus" @click="addNew({ text: dayjs().format('ddd, DD MMM YYYY') })" />
    <template v-slot:extension>
      <div class="w-100 text-center">
        Saldo: {{ toMoney(totalBalance) }}
      </div>
    </template>
  </v-app-bar>

  <v-container fluid>
    <v-row no-gutters>
      <v-col v-for="row, i in days" cols="12">
        <v-card variant="plain" class="mt-1" :id="row.id">
          <v-card-text>
            <v-row no-gutters>
              <v-col cols="10" class="font-weight-bold" @click="addNew(row)">
                {{ row.text }}
              </v-col>
              <v-col cols="2" class="text-right">
                <v-icon class="i-mdi:chevron-right"></v-icon>
              </v-col>
              <template v-for="log in row.logs">
                <v-col cols="8" class="mt-4">
                  {{ log.title }}
                </v-col>
                <v-col cols="4"
                  :class="`mt-4 text-right ${log.tCode === 'C' ? `text-green-darken-3` : `text-red-darken-1`} font-weight-bold`">
                  {{ toMoney(log.tCode === 'D' ? log.amountOut : log.tCode === 'C' ? log.amountIn : '') }}
                </v-col>
              </template>
              <template v-if="row.totalIn || row.totalOut">
                <v-col cols="6" class="mt-4 text-center">
                  <v-chip rounded class=" text-green-darken-3 font-weight-bold">Masuk: {{ toMoney(row.totalIn)
                    }}</v-chip>
                </v-col>
                <v-col cols="6" class="mt-4 text-center">
                  <v-chip rounded class="text-red-darken-1 font-weight-bold">
                    Keluar: {{ toMoney(row.totalOut) }}
                  </v-chip>
                </v-col>
              </template>
            </v-row>
          </v-card-text>
        </v-card>
        <v-divider></v-divider>
      </v-col>
    </v-row>
    <v-skeleton-loader id="loader-skeleton" type="list-item-two-line" width="100%"></v-skeleton-loader>
    <LazyAddDailyRecord :dialog="dNewRecord" :transactiondate="tDate" @closeit="closeIt"
      @refreshparent="refreshParent" />
    <v-bottom-sheet v-model="notif">
      <v-card height="80vh">
        <v-card-text>
          <v-alert type="warning" color="primary" variant="tonal" class="mt-2">
            Sepertinya kamu belum bikin akun harta, yuk bikin dulu!<br>
            <NuxtLink to="/accounts">
              Klik disini
            </NuxtLink><br><br>
            <div>
              "Akun harta adalah media tempat penyimpanan uang atau harta. Contoh: Rekening Ayah, Rekening Bunda, Dompet
              Ayah, Dompet Bunda, Amplop, dll"
            </div>
          </v-alert>
        </v-card-text>
      </v-card>
    </v-bottom-sheet>
  </v-container>
</template>