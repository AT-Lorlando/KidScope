import { defineStore } from 'pinia'
import type { Group, Student } from '~/types'

export const useGroupsStore = defineStore('groups', {
  state: () => ({
    groups: [] as Group[],
    currentGroup: null as Group | null,
  }),

  actions: {
    async fetchAll() {
      const api = useAPI()
      const groups = await api<Group[]>('/groups', {
        method: 'GET',
      })
      this.groups = groups
      return groups
    },

    async fetchById(id: number) {
      const api = useAPI()
      const group = await api<Group>(`/groups/${id}`, {
        method: 'GET',
      })
      this.currentGroup = group
      return group
    },

    async create(data: { name: string }) {
      const api = useAPI()
      const group = await api<Group>('/groups', {
        method: 'POST',
        body: data,
      })
      this.groups.push(group)
      return group
    },

    async update(id: number, data: Partial<Group>) {
      const api = useAPI()
      const group = await api<Group>(`/groups/${id}`, {
        method: 'PUT',
        body: data,
      })
      const index = this.groups.findIndex((g) => g.id === id)
      if (index !== -1) {
        this.groups[index] = group
      }
      if (this.currentGroup?.id === id) {
        this.currentGroup = group
      }
      return group
    },

    async addStudent(groupId: number, studentId: number) {
      const api = useAPI()
      const group = await api<Group>(`/groups/${groupId}/add-student`, {
        method: 'POST',
        body: { studentId },
      })
      const index = this.groups.findIndex((g) => g.id === groupId)
      if (index !== -1) {
        this.groups[index] = group
      }
      if (this.currentGroup?.id === groupId) {
        this.currentGroup = group
      }
      return group
    },

    async removeStudent(groupId: number, studentId: number) {
      const api = useAPI()
      const group = await api<Group>(`/groups/${groupId}/remove-student`, {
        method: 'POST',
        body: { studentId },
      })
      const index = this.groups.findIndex((g) => g.id === groupId)
      if (index !== -1) {
        this.groups[index] = group
      }
      if (this.currentGroup?.id === groupId) {
        this.currentGroup = group
      }
      return group
    },
  },
})

