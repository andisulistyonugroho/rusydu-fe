export const useProfileStore = defineStore('profile', () => {
  const { $api } = useNuxtApp()
  const { user } = useAuthStore()
  const username = ref()

  const getUsername = (async () => {
    try {
      const { data } = await $api.get(`/Users/${user.userId}`, {
        params: {
          filter: {
            fields: ['username']
          }
        }
      })
      username.value = data.username
      return Promise.resolve(true)
    } catch (error) {
      return Promise.reject(error)
    }
  })

  const doLogout = (async () => {
    try {
      await $api.post('/Users/logout')
      return Promise.resolve(true)
    } catch (error) {
      return Promise.reject(error)
    }
  })

  const changePassword = (async (oldPassword: string, newPassword: string) => {
    try {
      await $api.post('/Users/change-password', {
        oldPassword: oldPassword,
        newPassword: newPassword
      })
      await doLogout()
      return Promise.resolve(true)
    } catch (error) {
      return Promise.reject(error)
    }
  })

  return {
    getUsername, changePassword, doLogout,
    username
  }
})