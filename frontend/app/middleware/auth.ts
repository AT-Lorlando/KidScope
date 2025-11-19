export default defineNuxtRouteMiddleware((to, from) => {
  // Skip middleware on server side to avoid premature redirection
  // Auth state is initialized on client side via auth.init.ts plugin
  if (import.meta.server) return

  const authStore = useAuthStore()

  if (!authStore.isAuthenticated) {
    return navigateTo('/login')
  }
})
