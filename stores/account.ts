export const useAccountStore = defineStore('account', () => {
  const { $api } = useNuxtApp()
  const { user } = useAuthStore()

  type Account = {
    id: null,
    title: null,
    sBalance: 0,
    eBalance: 0,
    isActive: true,
    createdAt: null,
    userId: null,
    updatedAt: null
  }
  const accounts = ref<Account[]>([])

  const getMyAccounts = (async () => {
    try {
      const { data } = await $api.get('/FinancialAccounts', {
        params: {
          filter: {
            where: {
              userId: user.userId
            }
          }
        }
      })
      accounts.value = data
    } catch (error) {
      return Promise.reject(error)
    }
  })

  return { getMyAccounts, accounts }
}, {
  persist: {
    storage: persistedState.localStorage,
    key: 'r00sydoo_account'
  }
})