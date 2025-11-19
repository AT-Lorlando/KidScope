import type { HttpContext } from '@adonisjs/core/http'
import Event from '#models/event'
import Student from '#models/student'
import Document from '#models/document'
import { createEventValidator, updateEventValidator } from '#validators/event'
import app from '@adonisjs/core/services/app'
import { join } from 'node:path'
import { randomBytes } from 'node:crypto'
import { mkdir } from 'node:fs/promises'
import { DateTime } from 'luxon'
import type { EventType } from '../types.js'

export default class EventsController {
  async index({ params, response }: HttpContext) {
    const student = await Student.findOrFail(params.id)
    const events = await Event.query()
      .where('student_id', student.id)
      .preload('documents')
      .orderBy('date', 'desc')
    return response.ok(events)
  }

  async store({ params, request, response }: HttpContext) {
    const student = await Student.findOrFail(params.id)
    const payload = await request.validateUsing(createEventValidator)
    const event = await Event.create({
      type: payload.type as EventType,
      title: payload.title,
      description: payload.description,
      date: DateTime.fromJSDate(payload.date as unknown as Date),
      report: payload.report,
      studentId: student.id,
    })
    await event.load('documents')
    return response.created(event)
  }

  async show({ params, response }: HttpContext) {
    const event = await Event.findOrFail(params.id)
    await event.load('documents')
    await event.load('student')
    return response.ok(event)
  }

  async update({ params, request, response }: HttpContext) {
    const event = await Event.findOrFail(params.id)
    const payload = await request.validateUsing(updateEventValidator)
    event.merge({
      type: payload.type as EventType,
      title: payload.title,
      description: payload.description,
      date: DateTime.fromJSDate(payload.date as unknown as Date),
      report: payload.report,
    })
    await event.save()
    await event.load('documents')
    return response.ok(event)
  }

  async uploadDocument({ params, request, response }: HttpContext) {
    const event = await Event.findOrFail(params.id)
    const file = request.file('document', {
      size: '10mb',
      extnames: ['pdf', 'doc', 'docx', 'jpg', 'jpeg', 'png'],
    })

    if (!file) {
      return response.badRequest({ message: 'No file provided' })
    }

    if (!file.isValid) {
      return response.badRequest({ message: file.errors[0].message })
    }

    const uploadsDir = app.makePath('storage', 'uploads')
    try {
      await mkdir(uploadsDir, { recursive: true })
    } catch (error) {
      // Directory already exists
    }

    const fileName = `${randomBytes(16).toString('hex')}-${file.clientName}`
    await file.move(uploadsDir, {
      name: fileName,
      overwrite: false,
    })

    if (!file.fileName) {
      return response.internalServerError({ message: 'Error uploading file' })
    }

    const document = await Document.create({
      eventId: event.id,
      fileName: file.clientName || file.fileName,
      storageUrl: join('uploads', file.fileName),
    })

    return response.created(document)
  }
}
