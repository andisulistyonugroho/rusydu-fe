export const useRecordStore = defineStore('record', () => {
  const { $api } = useNuxtApp()

  const addRecord = (async (payload: {
    title: string, tCode: string, amount: number,
    fromFinancialAccountId: number, toFinancialAccountId: number,
    tDate: string,
  }) => {
    try {
      const { data } = await $api.post('/FinancialRecords', {
        title: payload.title,
        amountIn: payload.tCode === 'C' ? payload.amount : 0,
        amountOut: payload.tCode === 'D' ? payload.amount : 0,
        tCode: payload.tCode,
        tDate: payload.tDate,
        financialAccountId: payload.tCode === 'C' ? payload.toFinancialAccountId : payload.fromFinancialAccountId
      })
      return Promise.resolve(true)
    } catch (error) {
      return Promise.reject(error)
    }
  })

  return { addRecord }
})