export default defineNuxtPlugin({
  name: 'auth-init',
  enforce: 'post',
  async setup() {
    const store = useAuthStore()
    
    if (import.meta.client) {
      try {
        // We MUST await here to ensure the auth state is restored 
        // BEFORE the router middleware runs.
        // Otherwise, the middleware will see an empty store and redirect to login.
        await store.fetchProfile()
      } catch (error) {
        // User is not authenticated or API error, ignore
      }
    }
  },
})
