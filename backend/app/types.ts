export const StudentLevels = [
  'maternelle',
  'CP',
  'CE1',
  'CE2',
  'CM1',
  'CM2',
  '6e',
  '5e',
  '4e',
  '3e',
  '2nde',
  '1ère',
  'Terminale',
] as const

export type StudentLevel = (typeof StudentLevels)[number]

export const EventTypes = [
  'discipline',
  'convocation',
  'orientation',
  'parent_meeting',
  'pedagogical_follow_up',
] as const

export type EventType = (typeof EventTypes)[number]

