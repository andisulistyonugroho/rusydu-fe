export const useRecordStore = defineStore('record', () => {
  const { $api } = useNuxtApp()
  const { user } = useAuthStore()
  const transactionLog = ref([])

  const addRecord = (async (payload: {
    title: string, tCode: string, amount: number,
    fromFinancialAccountId: number, toFinancialAccountId: number,
    tDate: string, monthlyBudgetId: number | undefined
  }) => {
    try {
      let amountIn = 0
      let amountOut = 0
      let financialAccountId = payload.toFinancialAccountId

      if (payload.tCode === 'C') {
        amountIn = payload.amount
      } else if (payload.tCode === 'D' || payload.tCode === 'M') {
        amountOut = payload.amount
        financialAccountId = payload.fromFinancialAccountId
      }

      const data = {
        title: payload.tCode === 'M' ? `M: ${payload.title}` : payload.title,
        amountIn: amountIn,
        amountOut: amountOut,
        tCode: payload.tCode === 'M' ? 'D' : payload.tCode,
        tDate: payload.tDate,
        financialAccountId: financialAccountId,
        userId: user.userId,
        monthlyBudgetId: payload.monthlyBudgetId
      }

      await $api.post('/FinancialRecords', data)

      if (payload.tCode === 'M') {
        // masuk terima mutasi
        const data = {
          title: `M: ${payload.title}`,
          amountIn: payload.amount,
          amountOut: 0,
          tCode: 'C',
          tDate: payload.tDate,
          financialAccountId: payload.toFinancialAccountId,
          userId: user.userId,
          monthlyBudgetId: payload.monthlyBudgetId
        }

        await $api.post('/FinancialRecords', data)
      }

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

  return { addRecord, getRecordInBetween, transactionLog }
}, {
  persist: {
    storage: persistedState.localStorage,
    key: 'r00sydoo_record'
  }
})