<script setup lang="ts">
definePageMeta({
  layout: 'secondlayer',
  middleware: 'auth'
})

const { $bus, $debounce } = useNuxtApp()
const dayjs = useDayjs()
const route = useRoute()
const accountIdRoute = route.query.accountId
let accountId = 0
if (typeof accountIdRoute === 'string') {
  accountId = parseInt(accountIdRoute)
}
const startDate = ref(dayjs().startOf('day'))
const dNewRecord = ref(false)
const days = ref<DailyRec[]>([])
const numOfDays = 31
const tlog = ref([])
const startIndex = ref(0)

const { getAccountRecordInBetween } = useRecordStore()
const { transactionLog } = storeToRefs(useRecordStore())

$bus.$emit('set-header', 'Histori Akun')
const data = ref({
  title: null,
  sBalance: null
})

const generateCalendar = (position?: string) => {
  tlog.value = JSON.parse(JSON.stringify(transactionLog.value))
  const backdate = []
  for (let i = 0; i <= numOfDays; i++) {
    const theDay = startDate.value.subtract(i, 'days')
    const logs = showLogs(theDay.format('YYYY-MM-DD'))
    if (logs.totalIn === 0 && logs.totalOut === 0) {
      continue
    }

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
  // const logs = tlog.value.filter((obj) => dayjs(obj.tDate).format('YYYY-MM-DD') === theDate)
  const logs = transactionLog.value.filter((obj) => dayjs(obj.tDate).format('YYYY-MM-DD') === theDate)
  const totalIn = logs.reduce((total, obj) => (
    total + obj.amountIn
  ), 0)
  const totalOut = logs.reduce((total, obj) => (
    total + obj.amountOut
  ), 0)

  return { list: logs, totalIn: totalIn, totalOut: totalOut }
}

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

  if (posy > ih) {
    return
  }

  if (posy <= ih) {
    // alert('do get older data')
    startDate.value = startDate.value.subtract(numOfDays, 'days').startOf('date')
    await getAccountRecordInBetween({
      startDate: startDate.value.subtract(numOfDays, 'days').format('YYYY-MM-DD 17:00:00'),
      endDate: startDate.value.format('YYYY-MM-DD 16:59:59'),
      accountId: accountId
    })

    generateCalendar()
  }
}, 1000, { leading: false, trailing: true })

onMounted(() => {
  generateCalendar()
  document.addEventListener("scroll", onScroll)
})

onBeforeUnmount(() => {
  document.removeEventListener("scroll", onScroll)
})

await getAccountRecordInBetween({
  startDate: startDate.value.subtract(numOfDays, 'days').format('YYYY-MM-DD 17:00:00'),
  endDate: startDate.value.format('YYYY-MM-DD 16:59:59'),
  accountId: accountId
})
</script>
<template>
  <v-container fluid class="fill-height">
    <!-- <v-skeleton-loader type="list-item-two-line" width="100%"></v-skeleton-loader> -->
    <v-row no-gutters>
      <v-col v-for="row, i in days" cols="12">
        <v-card variant="plain" class="mt-1" :id="row.id">
          <v-card-text>
            <v-row no-gutters>
              <v-col cols="10" class="font-weight-bold">
                {{ row.text }}
              </v-col>
              <v-col cols="2" class="text-right" />
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
  </v-container>
</template>