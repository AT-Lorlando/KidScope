import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'groupe_eleve'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id').notNullable()
      table
        .integer('groupe_id')
        .unsigned()
        .references('id')
        .inTable('groupes')
        .onDelete('CASCADE')
        .notNullable()
      table
        .integer('eleve_id')
        .unsigned()
        .references('id')
        .inTable('eleves')
        .onDelete('CASCADE')
        .notNullable()

      table.unique(['groupe_id', 'eleve_id'])
      table.timestamp('created_at').notNullable()
      table.timestamp('updated_at').nullable()
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}