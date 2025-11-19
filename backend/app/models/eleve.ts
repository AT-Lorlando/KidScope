import { DateTime } from 'luxon'
import { BaseModel, column, hasMany, manyToMany } from '@adonisjs/lucid/orm'
import type { HasMany, ManyToMany } from '@adonisjs/lucid/types/relations'
import Evenement from './evenement.js'
import Groupe from './groupe.js'

export default class Eleve extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare nom: string

  @column()
  declare prenom: string

  @column.date()
  declare dateNaissance: DateTime

  @column()
  declare niveau:
    | 'maternelle'
    | 'CP'
    | 'CE1'
    | 'CE2'
    | 'CM1'
    | 'CM2'
    | '6e'
    | '5e'
    | '4e'
    | '3e'
    | '2nde'
    | '1ère'
    | 'Terminale'

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime | null

  @hasMany(() => Evenement)
  declare evenements: HasMany<typeof Evenement>

  @manyToMany(() => Groupe, {
    pivotTable: 'groupe_eleve',
  })
  declare groupes: ManyToMany<typeof Groupe>
}