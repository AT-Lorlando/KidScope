import type { HttpContext } from '@adonisjs/core/http'
import type { NextFn } from '@adonisjs/core/types/http'

/**
 * Middleware to check if the user is a teacher
 */
export default class TeacherMiddleware {
  async handle(ctx: HttpContext, next: NextFn) {
    await ctx.auth.authenticate()
    const user = ctx.auth.getUserOrFail()

    if (user.role !== 'teacher') {
      return ctx.response.forbidden({ message: 'Access reserved for teachers' })
    }

    return next()
  }
}
