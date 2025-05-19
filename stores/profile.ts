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

  return {
    getUsername,
    username
  }
})