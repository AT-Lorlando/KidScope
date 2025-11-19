import { DateTime } from 'luxon'
import { BaseModel, column, hasMany, manyToMany } from '@adonisjs/lucid/orm'
import type { HasMany, ManyToMany } from '@adonisjs/lucid/types/relations'
import Event from './event.js'
import Group from './group.js'
import type { StudentLevel } from '../types.js'

export default class Student extends BaseModel {
  static table = 'students'

  @column({ isPrimary: true })
  declare id: number

  @column()
  declare lastName: string

  @column()
  declare firstName: string

  @column.date()
  declare birthdate: DateTime

  @column()
  declare level: StudentLevel

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime | null

  @hasMany(() => Event, { foreignKey: 'studentId' })
  declare events: HasMany<typeof Event>

  @manyToMany(() => Group, {
    pivotTable: 'group_student',
    pivotForeignKey: 'student_id',
    pivotRelatedForeignKey: 'group_id',
  })
  declare groups: ManyToMany<typeof Group>
}
