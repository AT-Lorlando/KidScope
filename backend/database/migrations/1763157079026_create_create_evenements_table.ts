import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'evenements'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id').notNullable()
      table
        .integer('eleve_id')
        .unsigned()
        .references('id')
        .inTable('eleves')
        .onDelete('CASCADE')
        .notNullable()
      table.enum('type', [
        'discipline',
        'convocation',
        'orientation',
        'rencontre_parent',
        'suivi_pedagogique',
      ]).notNullable()
      table.string('titre').notNullable()
      table.text('description').nullable()
      table.date('date').notNullable()
      table.text('compte_rendu').nullable()

      table.timestamp('created_at').notNullable()
      table.timestamp('updated_at').nullable()
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}