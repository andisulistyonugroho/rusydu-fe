<script setup lang="ts">
definePageMeta({
  layout: 'secondlayernohead',
  middleware: 'auth'
})

const { $debounce, $bus } = useNuxtApp()
const { getRecordInBetween } = useRecordStore()
const { accounts } = storeToRefs(useAccountStore())
const { transactionLog } = storeToRefs(useRecordStore())

type FinancialRec = {
  id: number,
  title: string,
  amountIn: number,
  amountOut: number,
  tCode: string,
  tDate: string,
  createdAt: string
}

type DailyRec = {
  id: string,
  text: string,
  logs: FinancialRec[],
  totalIn: number,
  totalOut: number
}

const dayjs = useDayjs()
const startDate = ref(dayjs().startOf('day'))
const dNewRecord = ref(false)
const tDate = ref()
const days = ref<DailyRec[]>([])
const numOfDays = 8
const notif = ref(false)

const addNew = $debounce((data: { text: string }) => {
  dNewRecord.value = true
  tDate.value = data.text
}, 1000, { leading: true, trailing: false })

const closeIt = () => {
  dNewRecord.value = false
  tDate.value = null
}

await getRecordInBetween({
  startDate: startDate.value.subtract(numOfDays, 'days').format('YYYY-MM-DD 17:00:00'),
  endDate: startDate.value.format('YYYY-MM-DD 16:59:59')
})

const generateCalendar = (position?: string) => {
  const backdate = []
  for (let i = 0; i < numOfDays; i++) {
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

const showLogs = (theDate: string) => {
  const logs = transactionLog.value.filter((obj) => dayjs(obj.tDate).format('YYYY-MM-DD') === theDate)
  const totalIn = logs.reduce((total, obj) => {
    const objTitle = obj.title
    let amountIn = obj.amountIn
    if (objTitle.indexOf('M: ') === 0) {
      amountIn = 0
    }
    return total + amountIn
  }, 0)
  const totalOut = logs.reduce((total, obj) => {
    const objTitle = obj.title
    let amountOut = obj.amountOut
    if (objTitle.indexOf('M: ') === 0) {
      amountOut = 0
    }
    return total + amountOut
  }, 0)

  return { list: logs, totalIn: totalIn, totalOut: totalOut }
}

const refreshParent = (async () => {
  startDate.value = dayjs().startOf('day')
  await getRecordInBetween({
    startDate: startDate.value.subtract(numOfDays, 'days').format('YYYY-MM-DD 17:00:00'),
    endDate: startDate.value.format('YYYY-MM-DD 16:59:59')
  })
  days.value = []
  generateCalendar()
})

const onScroll = $debounce(async () => {
  const ih = window.innerHeight
  const ls = document.getElementById('loader-skeleton')
  let rect = {
    height: 0,
    y: 0
  }

  if (ls) {
    rect = ls.getBoundingClientRect()
  }
  const posy = rect.height + rect.y

  if (dNewRecord.value || posy > ih) {
    return
  }

  if (posy <= ih) {
    // alert('do get older data')
    startDate.value = startDate.value.subtract(numOfDays, 'days').startOf('date')
    await getRecordInBetween({
      startDate: startDate.value.subtract(numOfDays, 'days').format('YYYY-MM-DD 17:00:00'),
      endDate: startDate.value.format('YYYY-MM-DD 16:59:59')
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
  <v-app-bar class="border-b">
    <v-btn icon="i-mdi-arrow-left" @click="$router.back()" />
    <v-app-bar-title>RUSDU</v-app-bar-title>
    <v-btn icon="i-mdi-filter-outline" />
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
              <v-col cols="2" class="text-right" @click="addNew(row)">
                <v-icon class="i-mdi:chevron-right"></v-icon>
              </v-col>
              <template v-for="log in row.logs">
                <v-col cols="8" class="mt-4">
                  {{ log.title }}
                </v-col>
                <v-col cols="4"
                  :class="`mt-4 text-right ${log.tCode === 'C' ? `text-green-darken-3` : `text-red-darken-1`} font-weight-bold`">
                  {{ toMoney(log.tCode === 'D' ? log.amountOut : log.tCode === 'C' ? log.amountIn : 0) }}
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