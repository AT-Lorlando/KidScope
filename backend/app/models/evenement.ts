import { DateTime } from 'luxon'
import { BaseModel, column, belongsTo, hasMany } from '@adonisjs/lucid/orm'
import type { BelongsTo, HasMany } from '@adonisjs/lucid/types/relations'
import Eleve from './eleve.js'
import Document from './document.js'

export default class Evenement extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare eleveId: number

  @column()
  declare type:
    | 'discipline'
    | 'convocation'
    | 'orientation'
    | 'rencontre_parent'
    | 'suivi_pedagogique'

  @column()
  declare titre: string

  @column()
  declare description: string | null

  @column.date()
  declare date: DateTime

  @column()
  declare compteRendu: string | null

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime | null

  @belongsTo(() => Eleve)
  declare eleve: BelongsTo<typeof Eleve>

  @hasMany(() => Document)
  declare documents: HasMany<typeof Document>
}