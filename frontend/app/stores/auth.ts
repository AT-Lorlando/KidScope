import { defineStore } from 'pinia'

export interface User {
  id: number
  email: string
  nom: string | null
  prenom: string | null
  type: 'enseignant'
}

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

    async signup(email: string, password: string, nom: string, prenom: string) {
      const api = useAPI()
      await api('/signup', {
        method: 'POST',
        body: { email, password, nom, prenom, type: 'enseignant' },
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
          nom: user.nom ?? null,
          prenom: user.prenom ?? null,
          type: user.type,
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

