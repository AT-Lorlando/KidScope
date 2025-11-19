import type { HttpContext } from '@adonisjs/core/http'
import Group from '#models/group'
import Student from '#models/student'
import {
  createGroupValidator,
  updateGroupValidator,
  addStudentValidator,
  removeStudentValidator,
} from '#validators/group'

export default class GroupsController {
  async index({ auth, response }: HttpContext) {
    const user = auth.getUserOrFail()
    const groups = await Group.query()
      .where('user_id', user.id)
      .preload('students')
      .orderBy('name')
    return response.ok(groups)
  }

  async store({ auth, request, response }: HttpContext) {
    const user = auth.getUserOrFail()
    const payload = await request.validateUsing(createGroupValidator)
    const group = await Group.create({
      ...payload,
      userId: user.id,
    })
    return response.created(group)
  }

  async show({ params, auth, response }: HttpContext) {
    const user = auth.getUserOrFail()
    const group = await Group.query()
      .where('id', params.id)
      .where('user_id', user.id)
      .preload('students')
      .firstOrFail()
    return response.ok(group)
  }

  async update({ params, auth, request, response }: HttpContext) {
    const user = auth.getUserOrFail()
    const group = await Group.query()
      .where('id', params.id)
      .where('user_id', user.id)
      .firstOrFail()
    const payload = await request.validateUsing(updateGroupValidator)
    group.merge(payload)
    await group.save()
    await group.load('students')
    return response.ok(group)
  }

  async addStudent({ params, auth, request, response }: HttpContext) {
    const user = auth.getUserOrFail()
    const group = await Group.query()
      .where('id', params.id)
      .where('user_id', user.id)
      .firstOrFail()
    const { studentId } = await request.validateUsing(addStudentValidator)
    const student = await Student.findOrFail(studentId)
    await group.related('students').attach([student.id])
    await group.load('students')
    return response.ok(group)
  }

  async removeStudent({ params, auth, request, response }: HttpContext) {
    const user = auth.getUserOrFail()
    const group = await Group.query()
      .where('id', params.id)
      .where('user_id', user.id)
      .firstOrFail()
    const { studentId } = await request.validateUsing(removeStudentValidator)
    await group.related('students').detach([studentId])
    await group.load('students')
    return response.ok(group)
  }
}
