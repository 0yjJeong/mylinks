import { Knex } from 'knex';
import {
  createDatabase,
  createRouter,
} from '@mylinks/backend-plugin-dashboard';

const clientUrl = process.env.CLIENT_URL;

export default async function dashboard({ database }: { database: Knex }) {
  const db = await createDatabase(database);
  return createRouter(db, clientUrl);
}
