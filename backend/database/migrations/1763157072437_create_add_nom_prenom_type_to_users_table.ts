import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'users'

  async up() {
    this.schema.alterTable(this.tableName, (table) => {
      table.string('nom').nullable()
      table.string('prenom').nullable()
      table.enum('type', ['enseignant']).defaultTo('enseignant').notNullable()
    })
  }

  async down() {
    this.schema.alterTable(this.tableName, (table) => {
      table.dropColumn('nom')
      table.dropColumn('prenom')
      table.dropColumn('type')
    })
  }
}