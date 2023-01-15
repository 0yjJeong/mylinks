import knex, { Knex } from 'knex';

export async function up(knex: Knex) {
  return knex.schema
    .createTable('lists', (table) => {
      table.uuid('id').primary();
      table.string('title').notNullable();
      table.timestamp('created_at').defaultTo(knex.fn.now());
    })
    .createTable('lists_lists', (table) => {
      table.uuid('id').primary();
      table.uuid('source_id', { primaryKey: false }).unsigned();
      table
        .foreign('source_id')
        .references('id')
        .inTable('lists')
        .onDelete('CASCADE');
      table.uuid('target_id', { primaryKey: false }).unsigned();
      table
        .foreign('target_id')
        .references('id')
        .inTable('lists');
      table.timestamp('created_at').defaultTo(knex.fn.now());
    })
    .createTable('links', (table) => {
      table.uuid('id').primary();
      table.uuid('list_id', { primaryKey: false }).unsigned();
      table
        .foreign('list_id')
        .references('id')
        .inTable('lists')
        .onDelete('CASCADE');
      table.string('url').notNullable();
      table.string('title');
      table.string('image');
      table.text('description');
      table.timestamp('created_at').defaultTo(knex.fn.now());
    });
}

export async function down(knex: Knex) {
  return knex.schema
    .dropTable('lists')
    .dropTable('lists_lists')
    .dropTable('links');
}
