import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'events'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id').notNullable()
      table
        .integer('student_id')
        .unsigned()
        .references('id')
        .inTable('students')
        .onDelete('CASCADE')
        .notNullable()
      table.enum('type', [
        'discipline',
        'convocation',
        'orientation',
        'parent_meeting',
        'pedagogical_follow_up',
      ]).notNullable()
      table.string('title').notNullable()
      table.text('description').nullable()
      table.date('date').notNullable()
      table.text('report').nullable()

      table.timestamp('created_at').notNullable()
      table.timestamp('updated_at').nullable()
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
