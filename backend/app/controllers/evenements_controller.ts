import type { HttpContext } from '@adonisjs/core/http'
import Evenement from '#models/evenement'
import Eleve from '#models/eleve'
import Document from '#models/document'
import { createEvenementValidator, updateEvenementValidator } from '#validators/evenement'
import app from '@adonisjs/core/services/app'
import { join } from 'node:path'
import { randomBytes } from 'node:crypto'
import { mkdir } from 'node:fs/promises'

export default class EvenementsController {
  async index({ params, response }: HttpContext) {
    const eleve = await Eleve.findOrFail(params.id)
    const evenements = await Evenement.query()
      .where('eleve_id', eleve.id)
      .preload('documents')
      .orderBy('date', 'desc')
    return response.ok(evenements)
  }

  async store({ params, request, response }: HttpContext) {
    const eleve = await Eleve.findOrFail(params.id)
    const payload = await request.validateUsing(createEvenementValidator)
    const evenement = await Evenement.create({
      ...payload,
      eleveId: eleve.id,
    })
    await evenement.load('documents')
    return response.created(evenement)
  }

  async show({ params, response }: HttpContext) {
    const evenement = await Evenement.findOrFail(params.id)
    await evenement.load('documents')
    await evenement.load('eleve')
    return response.ok(evenement)
  }

  async update({ params, request, response }: HttpContext) {
    const evenement = await Evenement.findOrFail(params.id)
    const payload = await request.validateUsing(updateEvenementValidator)
    evenement.merge(payload)
    await evenement.save()
    await evenement.load('documents')
    return response.ok(evenement)
  }

  async uploadDocument({ params, request, response }: HttpContext) {
    const evenement = await Evenement.findOrFail(params.id)
    const file = request.file('document', {
      size: '10mb',
      extnames: ['pdf', 'doc', 'docx', 'jpg', 'jpeg', 'png'],
    })

    if (!file) {
      return response.badRequest({ message: 'Aucun fichier fourni' })
    }

    if (!file.isValid) {
      return response.badRequest({ message: file.errors[0].message })
    }

    // Créer le répertoire de stockage s'il n'existe pas
    const uploadsDir = app.makePath('storage', 'uploads')
    try {
      await mkdir(uploadsDir, { recursive: true })
    } catch (error) {
      // Le répertoire existe déjà, on continue
    }

    const fileName = `${randomBytes(16).toString('hex')}-${file.clientName}`
    await file.move(uploadsDir, {
      name: fileName,
      overwrite: false,
    })

    if (!file.fileName) {
      return response.internalServerError({ message: 'Erreur lors du téléchargement' })
    }

    const document = await Document.create({
      evenementId: evenement.id,
      nomFichier: file.clientName || file.fileName,
      urlStockage: join('uploads', file.fileName),
    })

    return response.created(document)
  }
}
