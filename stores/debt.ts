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
    debtId: number,
    monthlyBudgetId: number | null
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
  const parents = ref<Debt[]>([])

  const addDebt = (async (payload: {
    title: string, amount: number, debtType: string, tDate: string,
    toFinancialAccountId: number, parentId?: number
  }) => {
    try {
      await $api.post('/Debts', {
        title: payload.title,
        sBalance: payload.amount,
        eBalance: payload.amount,
        debtType: payload.debtType,
        tDate: payload.tDate,
        financialAccountId: payload.toFinancialAccountId,
        parentId: payload.parentId
      })
      Promise.resolve(true)
    } catch (error) {
      Promise.reject(error)
    }
  })

  const getDebt = (async () => {
    try {
      const params = {
        where: { isActive: 1, parentId: { eq: null } },
        order: 'id DESC'
      }
      const { data } = await $api.get('/Debts?filter=' + encodeURI(JSON.stringify(params)))
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
        debtId: payload.debtId,
        monthlyBudgetId: payload.monthlyBudgetId,
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

  const getParents = (async () => {
    try {
      const params = {
        where: { isActive: 1, parentId: { eq: null } },
        order: 'id DESC'
      }
      const { data } = await $api.get('/Debts?filter=' + encodeURI(JSON.stringify(params)))
      parents.value = data
      return Promise.resolve(true)
    } catch (error) {
      return Promise.reject(error)
    }
  })

  return {
    addDebt, getDebt, payDebt, getDebtHistory, getParents,
    debts, debt, parents
  }
})