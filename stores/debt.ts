export const useDebtStore = defineStore('debt', () => {
  const { $api } = useNuxtApp()
  const { user } = useAuthStore()

  type Debt = {
    id: number,
    title: string,
    sBalance: number,
    eBalance: number,
    debtType: string,
    tDate: string,
    isActive: boolean,
    createdAt: string,
    updatedAt: string,
    financialRecords?: FinancialRecord[]
  }

  type DebtPayment = {
    title: string,
    tCode: string,
    amount: number,
    tDate: string,
    fromFinancialAccountId: number,
    debtId: number
  }

  type FinancialRecord = {
    id: number,
    title: string,
    amountIn: number,
    amountOut: number,
    tCode: string,
    tDate: string,
    createdAt: string
  }

  const debts = ref<Debt[]>([])
  const debt = ref<Debt>()

  const addDebt = (async (payload: {
    title: string, amount: number, debtType: string, tDate: string,
    toFinancialAccountId: number
  }) => {
    try {
      await $api.post('/Debts', {
        title: payload.title,
        sBalance: payload.amount,
        eBalance: payload.amount,
        debtType: payload.debtType,
        tDate: payload.tDate,
        financialAccountId: payload.toFinancialAccountId
      })
      Promise.resolve(true)
    } catch (error) {
      Promise.reject(error)
    }
  })

  const getDebt = (async () => {
    try {
      const { data } = await $api.get('/Debts', { params: { filter: { order: 'id DESC' } } })
      debts.value = data
      return Promise.resolve(true)
    } catch (error) {
      return Promise.reject(error)
    }
  })

  const payDebt = (async (payload: DebtPayment) => {
    try {
      const data = {
        title: payload.title,
        amount: payload.amount,
        tDate: payload.tDate,
        financialAccountId: payload.fromFinancialAccountId,
        debtId: payload.debtId
      }

      await $api.post('/Debts/PayDebt', data)
      return Promise.resolve(true)
    } catch (error) {
      return Promise.reject(error)
    }
  })

  const getDebtHistory = (async (id: number) => {
    try {
      const { data } = await $api.get(`/Debts/${id}`, {
        params: {
          filter: {
            include: 'financialRecords'
          }
        }
      })
      debt.value = data
      return Promise.resolve(true)
    } catch (error) {
      return Promise.reject(error)
    }
  })

  return {
    addDebt, getDebt, payDebt, getDebtHistory,
    debts, debt
  }
})