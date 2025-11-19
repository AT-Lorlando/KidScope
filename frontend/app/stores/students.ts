import { defineStore } from 'pinia'
import type { Student, StudentLevel } from '~/types'

export const useStudentsStore = defineStore('students', {
  state: () => ({
    students: [] as Student[],
    currentStudent: null as Student | null,
  }),

  actions: {
    async fetchAll() {
      const api = useAPI()
      const students = await api<Student[]>('/students', {
        method: 'GET',
      })
      this.students = students
      return students
    },

    async fetchById(id: number) {
      const api = useAPI()
      const student = await api<Student>(`/students/${id}`, {
        method: 'GET',
      })
      this.currentStudent = student
      return student
    },

    async create(data: {
      firstName: string
      lastName: string
      birthdate: string
      level: StudentLevel
    }) {
      const api = useAPI()
      const student = await api<Student>('/students', {
        method: 'POST',
        body: data,
      })
      this.students.push(student)
      return student
    },

    async update(id: number, data: Partial<Student>) {
      const api = useAPI()
      const student = await api<Student>(`/students/${id}`, {
        method: 'PUT',
        body: data,
      })
      const index = this.students.findIndex((s) => s.id === id)
      if (index !== -1) {
        this.students[index] = student
      }
      if (this.currentStudent?.id === id) {
        this.currentStudent = student
      }
      return student
    },

    async fetchEvents(studentId: number) {
      const api = useAPI()
      const events = await api(`/students/${studentId}/events`, {
        method: 'GET',
      })
      return events
    },
  },
})

