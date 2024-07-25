// In Setup Stores:
// ref()s become state properties
// computed()s become getters
// function()s become actions

export const useAuthStore = defineStore('auth', () => {
  const { $api } = useNuxtApp()

  type ProfileType = {
    [key: string]: any
  }
  const profile: ProfileType = {}
  const user = reactive({
    token: '',
    userId: 0,
    profile: profile,
    role: ''
  })
  const dark = ref('')

  function setUser(obj: { token: string, userId: number }) {
    user.token = obj.token
    user.userId = obj.userId
  }
  function setProfile(value: object) {
    user.profile = value
  }
  function setRole(value: string) {
    user.role = value
  }
  async function logout() {
    user.token = ''
    user.userId = 0
    user.profile = {}
    user.role = ''
  }
  const changingTheme = (value: boolean) => {
    dark.value = value ? 'light' : 'dark'
  }
  const register = (async (payload: {
    realm: string,
    username: string,
    email: string,
    password: string
  }) => {
    try {
      const { data } = await $api.post('/Users', {
        realm: payload.realm,
        username: payload.username,
        email: payload.email,
        password: payload.password,
        emailVerified: true
      })
      return Promise.resolve(data)
    } catch (error) {
      return Promise.reject(error)
    }
  })

  return { setUser, setProfile, setRole, logout, changingTheme, register, user, dark }
},
  {
    persist: {
      storage: persistedState.localStorage,
      key: 'n3tand41n'
    }
  }
)