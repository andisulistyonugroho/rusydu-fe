export default defineNuxtRouteMiddleware((to, from) => {
  const { user } = useAuthStore()
  const { accounts } = useAccountStore()

  if (to.path !== '/logreg') {
    if (!user.token) {
      return navigateTo('/logreg')
    } else if (to.path !== '/accounts' && accounts.length < 1) {
      return navigateTo('/accounts')
    }
  } else if (to.path === '/logreg' && user.token) {
    return navigateTo('/')
  }

})