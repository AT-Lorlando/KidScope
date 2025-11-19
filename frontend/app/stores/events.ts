import { defineStore } from 'pinia'
import type { Event, EventType, Document } from '~/types'

export const useEventsStore = defineStore('events', {
  state: () => ({
    events: [] as Event[],
    currentEvent: null as Event | null,
  }),

  actions: {
    async fetchByStudent(studentId: number) {
      const api = useAPI()
      const events = await api<Event[]>(`/students/${studentId}/events`, {
        method: 'GET',
      })
      this.events = events
      return events
    },

    async fetchById(id: number) {
      const api = useAPI()
      const event = await api<Event>(`/events/${id}`, {
        method: 'GET',
      })
      this.currentEvent = event
      return event
    },

    async create(studentId: number, data: {
      type: EventType
      title: string
      description?: string
      date: string
      report?: string
    }) {
      const api = useAPI()
      const event = await api<Event>(`/students/${studentId}/events`, {
        method: 'POST',
        body: data,
      })
      this.events.push(event)
      return event
    },

    async update(id: number, data: Partial<Event>) {
      const api = useAPI()
      const event = await api<Event>(`/events/${id}`, {
        method: 'PUT',
        body: data,
      })
      const index = this.events.findIndex((e) => e.id === id)
      if (index !== -1) {
        this.events[index] = event
      }
      if (this.currentEvent?.id === id) {
        this.currentEvent = event
      }
      return event
    },

    async uploadDocument(eventId: number, file: File) {
      const api = useAPI()
      const formData = new FormData()
      formData.append('document', file)
      const document = await api<Document>(`/events/${eventId}/documents`, {
        method: 'POST',
        body: formData,
      })
      return document
    },
  },
})

