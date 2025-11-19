import vine from '@vinejs/vine'
import User from '#models/user'

export const signupValidator = vine.compile(
  vine.object({
    email: vine
      .string()
      .email()
      .unique(async (value) => {
        const user = await User.findBy('email', value)
        return !user
      }),
    password: vine.string().minLength(8),
    firstName: vine.string().minLength(1),
    lastName: vine.string().minLength(1),
    role: vine.enum(['teacher']).optional(),
  })
)

export const loginValidator = vine.compile(
  vine.object({
    email: vine.string().email(),
    password: vine.string(),
  })
)
