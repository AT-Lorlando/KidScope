import vine from '@vinejs/vine'
import { StudentLevels } from '../types.js'

export const createStudentValidator = vine.compile(
  vine.object({
    firstName: vine.string().minLength(1),
    lastName: vine.string().minLength(1),
    birthdate: vine.date(),
    level: vine.enum(StudentLevels),
  })
)

export const updateStudentValidator = vine.compile(
  vine.object({
    firstName: vine.string().minLength(1).optional(),
    lastName: vine.string().minLength(1).optional(),
    birthdate: vine.date().optional(),
    level: vine.enum(StudentLevels).optional(),
  })
)
