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
    updatedAt: string
  }

  const debts = ref<Debt[]>([])

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

  return {
    addDebt, getDebt,
    debts
  }
})