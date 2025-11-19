import type { HttpContext } from '@adonisjs/core/http'
import type { NextFn } from '@adonisjs/core/types/http'

/**
 * Middleware pour vérifier que l'utilisateur est de type enseignant
 */
export default class EnseignantMiddleware {
  async handle(ctx: HttpContext, next: NextFn) {
    await ctx.auth.authenticate()
    const user = ctx.auth.getUserOrFail()

    if (user.type !== 'enseignant') {
      return ctx.response.forbidden({ message: 'Accès réservé aux enseignants' })
    }

    return next()
  }
}




