import { Knex } from 'knex';
import {
  createDatabase,
  createRouter,
} from '@mylinks/backend-plugin-dashboard';

export default async function dashboard({ database }: { database: Knex }) {
  const db = await createDatabase(database);
  return createRouter(db, 'http://localhost:5173');
}
