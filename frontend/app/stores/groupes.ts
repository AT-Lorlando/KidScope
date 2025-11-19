import { defineStore } from 'pinia'
import type { Eleve } from './eleves'

export interface Groupe {
  id: number
  userId: number
  nom: string
  eleves?: Eleve[]
  createdAt: string
  updatedAt: string | null
}

export const useGroupesStore = defineStore('groupes', {
  state: () => ({
    groupes: [] as Groupe[],
    groupeCourant: null as Groupe | null,
  }),

  actions: {
    async fetchAll() {
      const api = useAPI()
      const groupes = await api<Groupe[]>('/groupes', {
        method: 'GET',
      })
      this.groupes = groupes
      return groupes
    },

    async fetchById(id: number) {
      const api = useAPI()
      const groupe = await api<Groupe>(`/groupes/${id}`, {
        method: 'GET',
      })
      this.groupeCourant = groupe
      return groupe
    },

    async create(data: { nom: string }) {
      const api = useAPI()
      const groupe = await api<Groupe>('/groupes', {
        method: 'POST',
        body: data,
      })
      this.groupes.push(groupe)
      return groupe
    },

    async update(id: number, data: Partial<Groupe>) {
      const api = useAPI()
      const groupe = await api<Groupe>(`/groupes/${id}`, {
        method: 'PUT',
        body: data,
      })
      const index = this.groupes.findIndex((g) => g.id === id)
      if (index !== -1) {
        this.groupes[index] = groupe
      }
      if (this.groupeCourant?.id === id) {
        this.groupeCourant = groupe
      }
      return groupe
    },

    async ajouterEleve(groupeId: number, eleveId: number) {
      const api = useAPI()
      const groupe = await api<Groupe>(`/groupes/${groupeId}/ajouter-eleve`, {
        method: 'POST',
        body: { eleveId },
      })
      const index = this.groupes.findIndex((g) => g.id === groupeId)
      if (index !== -1) {
        this.groupes[index] = groupe
      }
      if (this.groupeCourant?.id === groupeId) {
        this.groupeCourant = groupe
      }
      return groupe
    },

    async retirerEleve(groupeId: number, eleveId: number) {
      const api = useAPI()
      const groupe = await api<Groupe>(`/groupes/${groupeId}/retirer-eleve`, {
        method: 'POST',
        body: { eleveId },
      })
      const index = this.groupes.findIndex((g) => g.id === groupeId)
      if (index !== -1) {
        this.groupes[index] = groupe
      }
      if (this.groupeCourant?.id === groupeId) {
        this.groupeCourant = groupe
      }
      return groupe
    },
  },
})




