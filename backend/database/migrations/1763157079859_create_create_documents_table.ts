import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'documents'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id').notNullable()
      table
        .integer('evenement_id')
        .unsigned()
        .references('id')
        .inTable('evenements')
        .onDelete('CASCADE')
        .notNullable()
      table.string('nom_fichier').notNullable()
      table.string('url_stockage').notNullable()

      table.timestamp('created_at').notNullable()
      table.timestamp('updated_at').nullable()
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}