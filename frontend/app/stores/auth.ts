import { defineStore } from 'pinia'
import type { User } from '~/types'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: null as User | null,
  }),

  getters: {
    isAuthenticated: (state) => state.user !== null,
  },

  actions: {
    async login(email: string, password: string) {
      const api = useAPI()
      await api('/login', {
        method: 'POST',
        body: { email, password },
      })
      await this.fetchProfile()
    },

    async signup(email: string, password: string, firstName: string, lastName: string) {
      const api = useAPI()
      await api('/signup', {
        method: 'POST',
        body: { email, password, firstName, lastName, role: 'teacher' },
      })
      await this.fetchProfile()
    },

    async fetchProfile() {
      const api = useAPI()
      try {
        const user = await api<User>('/me', {
          method: 'GET',
        })
        this.user = {
          id: user.id,
          email: user.email,
          firstName: user.firstName ?? null,
          lastName: user.lastName ?? null,
          role: user.role,
        }
      } catch (error) {
        this.user = null
        throw error
      }
    },

    async logout() {
      const api = useAPI()
      try {
        await api('/logout', {
          method: 'POST',
        })
      } finally {
        this.user = null
      }
    },
  },
})
