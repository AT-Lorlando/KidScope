import vine from '@vinejs/vine'

export const createGroupValidator = vine.compile(
  vine.object({
    name: vine.string().minLength(1),
  })
)

export const updateGroupValidator = vine.compile(
  vine.object({
    name: vine.string().minLength(1).optional(),
  })
)

export const addStudentValidator = vine.compile(
  vine.object({
    studentId: vine.number(),
  })
)

export const removeStudentValidator = vine.compile(
  vine.object({
    studentId: vine.number(),
  })
)
