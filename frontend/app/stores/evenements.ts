import { defineStore } from 'pinia'

export interface Document {
  id: number
  evenementId: number
  nomFichier: string
  urlStockage: string
  createdAt: string
  updatedAt: string | null
}

export interface Evenement {
  id: number
  eleveId: number
  type: 'discipline' | 'convocation' | 'orientation' | 'rencontre_parent' | 'suivi_pedagogique'
  titre: string
  description: string | null
  date: string
  compteRendu: string | null
  documents?: Document[]
  createdAt: string
  updatedAt: string | null
}

export const useEvenementsStore = defineStore('evenements', {
  state: () => ({
    evenements: [] as Evenement[],
    evenementCourant: null as Evenement | null,
  }),

  actions: {
    async fetchByEleve(eleveId: number) {
      const api = useAPI()
      const evenements = await api<Evenement[]>(`/eleves/${eleveId}/evenements`, {
        method: 'GET',
      })
      this.evenements = evenements
      return evenements
    },

    async fetchById(id: number) {
      const api = useAPI()
      const evenement = await api<Evenement>(`/evenements/${id}`, {
        method: 'GET',
      })
      this.evenementCourant = evenement
      return evenement
    },

    async create(eleveId: number, data: {
      type: Evenement['type']
      titre: string
      description?: string
      date: string
      compteRendu?: string
    }) {
      const api = useAPI()
      const evenement = await api<Evenement>(`/eleves/${eleveId}/evenements`, {
        method: 'POST',
        body: data,
      })
      this.evenements.push(evenement)
      return evenement
    },

    async update(id: number, data: Partial<Evenement>) {
      const api = useAPI()
      const evenement = await api<Evenement>(`/evenements/${id}`, {
        method: 'PUT',
        body: data,
      })
      const index = this.evenements.findIndex((e) => e.id === id)
      if (index !== -1) {
        this.evenements[index] = evenement
      }
      if (this.evenementCourant?.id === id) {
        this.evenementCourant = evenement
      }
      return evenement
    },

    async uploadDocument(evenementId: number, file: File) {
      const api = useAPI()
      const formData = new FormData()
      formData.append('document', file)
      const document = await api<Document>(`/evenements/${evenementId}/documents`, {
        method: 'POST',
        body: formData,
      })
      return document
    },
  },
})




