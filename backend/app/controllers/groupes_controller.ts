import type { HttpContext } from '@adonisjs/core/http'
import Groupe from '#models/groupe'
import Eleve from '#models/eleve'
import {
  createGroupeValidator,
  updateGroupeValidator,
  ajouterEleveValidator,
  retirerEleveValidator,
} from '#validators/groupe'

export default class GroupesController {
  async index({ auth, response }: HttpContext) {
    const user = auth.getUserOrFail()
    const groupes = await Groupe.query()
      .where('user_id', user.id)
      .preload('eleves')
      .orderBy('nom')
    return response.ok(groupes)
  }

  async store({ auth, request, response }: HttpContext) {
    const user = auth.getUserOrFail()
    const payload = await request.validateUsing(createGroupeValidator)
    const groupe = await Groupe.create({
      ...payload,
      userId: user.id,
    })
    return response.created(groupe)
  }

  async show({ params, auth, response }: HttpContext) {
    const user = auth.getUserOrFail()
    const groupe = await Groupe.query()
      .where('id', params.id)
      .where('user_id', user.id)
      .preload('eleves')
      .firstOrFail()
    return response.ok(groupe)
  }

  async update({ params, auth, request, response }: HttpContext) {
    const user = auth.getUserOrFail()
    const groupe = await Groupe.query()
      .where('id', params.id)
      .where('user_id', user.id)
      .firstOrFail()
    const payload = await request.validateUsing(updateGroupeValidator)
    groupe.merge(payload)
    await groupe.save()
    await groupe.load('eleves')
    return response.ok(groupe)
  }

  async ajouterEleve({ params, auth, request, response }: HttpContext) {
    const user = auth.getUserOrFail()
    const groupe = await Groupe.query()
      .where('id', params.id)
      .where('user_id', user.id)
      .firstOrFail()
    const { eleveId } = await request.validateUsing(ajouterEleveValidator)
    const eleve = await Eleve.findOrFail(eleveId)
    await groupe.related('eleves').attach([eleve.id])
    await groupe.load('eleves')
    return response.ok(groupe)
  }

  async retirerEleve({ params, auth, request, response }: HttpContext) {
    const user = auth.getUserOrFail()
    const groupe = await Groupe.query()
      .where('id', params.id)
      .where('user_id', user.id)
      .firstOrFail()
    const { eleveId } = await request.validateUsing(retirerEleveValidator)
    await groupe.related('eleves').detach([eleveId])
    await groupe.load('eleves')
    return response.ok(groupe)
  }
}
