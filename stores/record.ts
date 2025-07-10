export const useRecordStore = defineStore('record', () => {
  const { $api } = useNuxtApp()
  const { user } = useAuthStore()

  const transactionLog = ref<FinancialRecord[]>([])
  const searchResult = ref<FinancialRecord[]>([])

  const addIncome = (async (payload: Income) => {
    try {
      const data = {
        title: payload.title,
        amountIn: payload.amountIn,
        amountOut: 0,
        tCode: 'C',
        tDate: payload.tDate,
        financialAccountId: payload.financialAccountId,
        userId: user.userId
      }
      await $api.post('/FinancialRecords', data)
      return Promise.resolve(true)
    } catch (error) {
      return Promise.reject(error)
    }
  })

  const addSpending = (async (payload: Spending) => {
    try {
      const data = {
        title: payload.title,
        amountIn: 0,
        amountOut: payload.amountOut,
        tCode: 'D',
        tDate: payload.tDate,
        financialAccountId: payload.financialAccountId,
        userId: user.userId,
        monthlyBudgetId: payload.monthlyBudgetId
      }
      await $api.post('/FinancialRecords', data)
      return Promise.resolve(true)
    } catch (error) {
      return Promise.reject(error)
    }
  })

  const addMutation = (async (payload: Mutation) => {
    try {
      // out
      const dataOut = {
        title: `M: ${payload.title}`,
        amountIn: 0,
        amountOut: payload.amountOut,
        tCode: 'D',
        tDate: payload.tDate,
        financialAccountId: payload.fromFinancialAccountId,
        userId: user.userId
      }
      await $api.post('/FinancialRecords', dataOut)

      // in
      const dataIn = {
        title: `M: ${payload.title}`,
        amountIn: payload.amountOut,
        amountOut: 0,
        tCode: 'C',
        tDate: payload.tDate,
        financialAccountId: payload.toFinancialAccountId,
        userId: user.userId
      }
      await $api.post('/FinancialRecords', dataIn)

      return Promise.resolve(true)
    } catch (error) {
      return Promise.reject(error)
    }
  })

  const getRecordInBetween = (async (payload: { startDate: string, endDate: string }) => {
    try {
      const { data } = await $api.get('/FinancialRecords', {
        params: {
          filter: {
            where: {
              isActive: 1,
              tDate: {
                between: [payload.startDate, payload.endDate]
              },
              userId: user.userId
            },
            order: 'tDate ASC'
          }
        }
      })
      transactionLog.value = data
      return Promise.resolve(data)
    } catch (error) {
      return Promise.reject(error)
    }
  })

  const getAccountRecordInBetween = (async (payload: { startDate: string, endDate: string, accountId: number }) => {
    try {
      const { data } = await $api.get('/FinancialRecords', {
        params: {
          filter: {
            where: {
              isActive: 1,
              financialAccountId: payload.accountId,
              tDate: {
                between: [payload.startDate, payload.endDate]
              },
              userId: user.userId
            },
            order: 'tDate ASC'
          }
        }
      })
      transactionLog.value = data
      return Promise.resolve(data)
    } catch (error) {
      return Promise.reject(error)
    }
  })

  const findRecord = async (payload: { title: string }) => {
    try {
      const { data } = await $api.get('/FinancialRecords', {
        params: {
          filter: {
            where: {
              userId: user.userId,
              isActive: 1,
              title: { like: `%${payload.title}%` }
            },
            order: "tDate DESC"
          }
        }
      })
      searchResult.value = data
      return Promise.resolve(true)
    } catch (error) {
      return Promise.reject(error)
    }
  }

  return {
    getRecordInBetween, getAccountRecordInBetween, findRecord, addIncome, addSpending, addMutation,
    transactionLog, searchResult
  }
}, {
  persist: {
    storage: persistedState.localStorage,
    key: 'r00sydoo_record'
  }
})