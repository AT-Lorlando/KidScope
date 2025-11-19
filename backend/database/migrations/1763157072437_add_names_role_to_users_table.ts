import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'users'

  async up() {
    this.schema.alterTable(this.tableName, (table) => {
      table.string('last_name').nullable()
      table.string('first_name').nullable()
      table.enum('role', ['teacher']).defaultTo('teacher').notNullable()
    })
  }

  async down() {
    this.schema.alterTable(this.tableName, (table) => {
      table.dropColumn('last_name')
      table.dropColumn('first_name')
      table.dropColumn('role')
    })
  }
}
