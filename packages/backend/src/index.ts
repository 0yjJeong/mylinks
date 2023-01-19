import express from 'express';
import knex from 'knex';
import cors from 'cors';

import 'dotenv/config';

import dashboard from './plugins/dashboard';

const DEFAULT_PORT = 5000;
const PORT = parseInt(process.env.PORT ?? '', 10) || DEFAULT_PORT;

const DEFAULT_DATABASE_URL =
  'postgres://dashboard:dashboard@localhost:5432/dashboard';
const DATABASE_URL = process.env.DATABASE_URL || DEFAULT_DATABASE_URL;

function dashboardEnv() {
  return {
    database: knex({
      client: 'pg',
      connection: DATABASE_URL,
    }),
  };
}

async function run() {
  const app = express();

  if (process.env.NODE_ENV === 'development') {
    app.use(cors({ origin: process.env.CLIENT_URL }));
  }
  app.use(express.json());
  app.use('/dashboard', await dashboard(dashboardEnv()));

  app.use('/ping', (req, res) => {
    res.status(200).send('pong');
  });

  app.listen(PORT, () => {
    console.log(`Listening on port ${PORT}`);
  });
}

run();
