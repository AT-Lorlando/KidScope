import { defineStore } from 'pinia'

export interface Eleve {
  id: number
  nom: string
  prenom: string
  dateNaissance: string
  niveau:
    | 'maternelle'
    | 'CP'
    | 'CE1'
    | 'CE2'
    | 'CM1'
    | 'CM2'
    | '6e'
    | '5e'
    | '4e'
    | '3e'
    | '2nde'
    | '1ère'
    | 'Terminale'
  createdAt: string
  updatedAt: string | null
}

export const useElevesStore = defineStore('eleves', {
  state: () => ({
    eleves: [] as Eleve[],
    eleveCourant: null as Eleve | null,
  }),

  actions: {
    async fetchAll() {
      const api = useAPI()
      const eleves = await api<Eleve[]>('/eleves', {
        method: 'GET',
      })
      this.eleves = eleves
      return eleves
    },

    async fetchById(id: number) {
      const api = useAPI()
      const eleve = await api<Eleve>(`/eleves/${id}`, {
        method: 'GET',
      })
      this.eleveCourant = eleve
      return eleve
    },

    async create(data: {
      nom: string
      prenom: string
      dateNaissance: string
      niveau: Eleve['niveau']
    }) {
      const api = useAPI()
      const eleve = await api<Eleve>('/eleves', {
        method: 'POST',
        body: data,
      })
      this.eleves.push(eleve)
      return eleve
    },

    async update(id: number, data: Partial<Eleve>) {
      const api = useAPI()
      const eleve = await api<Eleve>(`/eleves/${id}`, {
        method: 'PUT',
        body: data,
      })
      const index = this.eleves.findIndex((e) => e.id === id)
      if (index !== -1) {
        this.eleves[index] = eleve
      }
      if (this.eleveCourant?.id === id) {
        this.eleveCourant = eleve
      }
      return eleve
    },

    async fetchEvenements(eleveId: number) {
      const api = useAPI()
      const evenements = await api(`/eleves/${eleveId}/evenements`, {
        method: 'GET',
      })
      return evenements
    },
  },
})




