import type { HttpContext } from '@adonisjs/core/http'
import Eleve from '#models/eleve'
import { createEleveValidator, updateEleveValidator } from '#validators/eleve'

export default class ElevesController {
  async index({ response }: HttpContext) {
    const eleves = await Eleve.query().orderBy('nom').orderBy('prenom')
    return response.ok(eleves)
  }

  async store({ request, response }: HttpContext) {
    const payload = await request.validateUsing(createEleveValidator)
    const eleve = await Eleve.create(payload)
    return response.created(eleve)
  }

  async show({ params, response }: HttpContext) {
    const eleve = await Eleve.findOrFail(params.id)
    return response.ok(eleve)
  }

  async update({ params, request, response }: HttpContext) {
    const eleve = await Eleve.findOrFail(params.id)
    const payload = await request.validateUsing(updateEleveValidator)
    eleve.merge(payload)
    await eleve.save()
    return response.ok(eleve)
  }
}
