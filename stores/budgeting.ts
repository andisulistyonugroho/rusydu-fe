export const useBudgetingStore = defineStore('budgeting', () => {
  const { $api } = useNuxtApp()
  const { user } = useAuthStore()

  const availableMonths = ref<AvailableMonth[]>([])
  const budgets = ref<Budget[]>([])
  const availableBudgets = ref<Budget[]>([])

  const getAvailableMonth = (async () => {
    try {
      const { data } = await $api.post<AvailableMonth[]>('/MonthlyBudgets/availableMonth')
      availableMonths.value = data
      return Promise.resolve(true)
    } catch (error) {
      return Promise.reject(error)
    }
  })
  const addMyBudget = (async (payload: { title: string, thePeriod: string, amount: number }) => {
    try {
      const { data } = await $api.post('/MonthlyBudgets', {
        userId: user.userId,
        title: payload.title,
        amount: payload.amount,
        amountLeft: payload.amount,
        thePeriod: payload.thePeriod
      })
      return Promise.resolve(data)
    } catch (error) {
      return Promise.reject(error)
    }
  })
  const getBudgetInPeriod = (async (thePeriod: string) => {
    try {
      const { data } = await $api.get('/MonthlyBudgets', {
        params: {
          filter: {
            where: { thePeriod: thePeriod },
            include: 'financialRecords'
          }
        }
      })
      budgets.value = data
      return Promise.resolve(true)
    } catch (error) {
      return Promise.reject(error)
    }
  })
  const payBudget = (async (payload: SpendingBudget) => {
    try {
      await $api.post('/MonthlyBudgets/payment', {
        title: payload.title,
        tCode: 'D',
        amountOut: payload.amount,
        tDate: payload.tDate,
        financialAccountId: payload.fromFinancialAccountId,
        userId: user.userId,
        monthlyBudgetId: payload.monthlyBudgetId
      })
      return Promise.resolve(true)
    } catch (error) {
      return Promise.reject(error)
    }
  })
  const setAsCompleted = (async (id: number) => {
    try {
      await $api.post('/MonthlyBudgets/setAsCompleted', { id: id })
      return Promise.resolve(true)
    } catch (error) {
      return Promise.reject(error)
    }
  })
  const getBudgetAvailableInPeriod = (async (thePeriod: string) => {
    try {
      const { data } = await $api.get('/MonthlyBudgets', {
        params: {
          filter: {
            where: { thePeriod: thePeriod, isActive: true, amountLeft: { gt: 0 } }
          }
        }
      })
      availableBudgets.value = data
      return Promise.resolve(true)
    } catch (error) {
      return Promise.reject(error)
    }
  })

  return {
    getAvailableMonth, addMyBudget, getBudgetInPeriod, payBudget, setAsCompleted, getBudgetAvailableInPeriod,
    availableMonths, budgets, availableBudgets
  }
}, {
  persist: {
    storage: persistedState.localStorage,
    key: 'r00sydoo_budgeting'
  }
})