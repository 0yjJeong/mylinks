import { Knex } from 'knex';
import path from 'path';
import Database from './Database';

export async function createDatabase(database: Knex) {
  await database.migrate.latest({
    directory: path.resolve(__dirname, '../migrations'),
  });

  return new Database(database);
}
