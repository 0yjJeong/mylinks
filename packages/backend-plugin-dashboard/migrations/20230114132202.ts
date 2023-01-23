import knex, { Knex } from 'knex';

export async function up(knex: Knex) {
  return knex.schema
    .createTable('tables', (table) => {
      table.uuid('id').primary();
      table.string('title').notNullable();
      table.timestamp('created_at').defaultTo(knex.fn.now());
    })
    .createTable('table_to_tables', (table) => {
      table.uuid('id').primary();
      table.uuid('source_id', { primaryKey: false }).unsigned();
      table
        .foreign('source_id')
        .references('id')
        .inTable('tables')
        .onDelete('CASCADE');
      table.uuid('target_id', { primaryKey: false }).unsigned();
      table
        .foreign('target_id')
        .references('id')
        .inTable('tables');
      table.timestamp('created_at').defaultTo(knex.fn.now());
    })
    .createTable('rows', (table) => {
      table.uuid('id').primary();
      table.uuid('table_id', { primaryKey: false }).unsigned();
      table
        .foreign('table_id')
        .references('id')
        .inTable('tables')
        .onDelete('CASCADE');
      table.string('url');
      table.string('title');
      table.string('image');
      table.text('description');
      table.timestamp('created_at').defaultTo(knex.fn.now());
    });
}

export async function down(knex: Knex) {
  return knex.schema
    .dropTable('tables')
    .dropTable('table_to_tables')
    .dropTable('rows');
}
