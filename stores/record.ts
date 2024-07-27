export const useRecordStore = defineStore('record', () => {
  const { $api } = useNuxtApp()

  const addRecord = (async (payload: {
    title: string, amount: number, tCode: string, tDate: string,
    fromFinancialAccountId: number, toFinancialAccountId: number
  }) => {
    try {

      const generatedInput = generateInput({
        tCode: payload.tCode, amount: payload.amount,
        fromFinancialAccountId: payload.fromFinancialAccountId,
        toFinancialAccountId: payload.toFinancialAccountId
      })

      const { data } = await $api.post('/FinancialRecords', {
        title: payload.title,
        amountIn: generatedInput.amountIn,
        amountOut: generatedInput.amountOut,
        financialAccountId: generatedInput.financeAccountId
      })
      return Promise.resolve(data)
    } catch (error) {
      return Promise.reject(error)
    }
  })

  const generateInput = ((input: { tCode: string, amount: number, fromFinancialAccountId: number, toFinancialAccountId: number }) => {
    let amountIn = 0
    let amountOut = 0
    let financeAccountId = null

    if (input.tCode === 'C') {
      amountIn = input.amount
      financeAccountId = input.toFinancialAccountId
    } else if (input.tCode === 'D') {
      amountOut = input.amount
      financeAccountId = input.fromFinancialAccountId
    }

    return {
      amountIn: amountIn,
      amountOut: amountOut,
      financeAccountId: financeAccountId
    }
  })

  return { addRecord }
})