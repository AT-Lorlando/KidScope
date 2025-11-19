import { DateTime } from 'luxon'
import { BaseModel, column, belongsTo, hasMany } from '@adonisjs/lucid/orm'
import type { BelongsTo, HasMany } from '@adonisjs/lucid/types/relations'
import Student from './student.js'
import Document from './document.js'
import type { EventType } from '../types.js'

export default class Event extends BaseModel {
  static table = 'events'

  @column({ isPrimary: true })
  declare id: number

  @column()
  declare studentId: number

  @column()
  declare type: EventType

  @column()
  declare title: string

  @column()
  declare description: string | null

  @column.date()
  declare date: DateTime

  @column()
  declare report: string | null

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime | null

  @belongsTo(() => Student, { foreignKey: 'studentId' })
  declare student: BelongsTo<typeof Student>

  @hasMany(() => Document, { foreignKey: 'eventId' })
  declare documents: HasMany<typeof Document>
}
