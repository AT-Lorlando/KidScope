import type { HttpContext } from '@adonisjs/core/http'
import Student from '#models/student'
import { createStudentValidator, updateStudentValidator } from '#validators/student'
import { DateTime } from 'luxon'
import type { StudentLevel } from '../types.js'

export default class StudentsController {
  async index({ response }: HttpContext) {
    const students = await Student.query().orderBy('last_name').orderBy('first_name')
    return response.ok(students)
  }

  async store({ request, response }: HttpContext) {
    const payload = await request.validateUsing(createStudentValidator)
    const student = await Student.create({
      lastName: payload.lastName,
      firstName: payload.firstName,
      birthdate: DateTime.fromJSDate(payload.birthdate),
      level: payload.level as StudentLevel,
    })
    return response.created(student)
  }

  async show({ params, response }: HttpContext) {
    const student = await Student.findOrFail(params.id)
    return response.ok(student)
  }

  async update({ params, request, response }: HttpContext) {
    const student = await Student.findOrFail(params.id)
    const payload = await request.validateUsing(updateStudentValidator)
    const birthdate = payload.birthdate ? DateTime.fromJSDate(payload.birthdate) : undefined
    student.merge({
      lastName: payload.lastName,
      firstName: payload.firstName,
      birthdate: birthdate,
      level: payload.level as StudentLevel,
    })
    await student.save()
    return response.ok(student)
  }
}
