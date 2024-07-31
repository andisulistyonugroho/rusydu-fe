export const useBudgetingStore = defineStore('budgeting', () => {
  const { $api, $dayjs } = useNuxtApp()
  const { user } = useAuthStore()
  const availableMonths = ref([])

  const getAvailableMonth = (async () => {
    try {
      const { data } = await $api.post('/MonthlyBudgets/availableMonth')
      availableMonths.value = data
      return Promise.resolve(true)
    } catch (error) {
      return Promise.reject(error)
    }
  })

  return { getAvailableMonth, availableMonths }
}, {
  persist: {
    storage: persistedState.localStorage,
    key: 'r00sydoo_budgeting'
  }
})