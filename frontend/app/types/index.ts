// User types
export interface User {
  id: number
  email: string
  firstName: string | null
  lastName: string | null
  role: 'teacher'
}

// Student types
export type StudentLevel =
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

export interface Student {
  id: number
  firstName: string
  lastName: string
  birthdate: string
  level: StudentLevel
  createdAt: string
  updatedAt: string | null
}

// Event types
export type EventType =
  | 'discipline'
  | 'convocation'
  | 'orientation'
  | 'parent_meeting'
  | 'pedagogical_follow_up'

export interface Document {
  id: number
  eventId: number
  fileName: string
  storageUrl: string
  createdAt: string
  updatedAt: string | null
}

export interface Event {
  id: number
  studentId: number
  type: EventType
  title: string
  description: string | null
  date: string
  report: string | null
  documents?: Document[]
  createdAt: string
  updatedAt: string | null
}

// Group types
export interface Group {
  id: number
  userId: number
  name: string
  students?: Student[]
  createdAt: string
  updatedAt: string | null
}
