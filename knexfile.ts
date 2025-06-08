import type { Knex } from 'knex';
import dotenv from 'dotenv';

dotenv.config(); // Loads .env variables

const config: { [key: string]: Knex.Config } = {
  development: {
    client: 'pg',
    connection: process.env.DATABASE_URL, // e.g., postgres://user:pass@localhost:5432/db
    pool: { min: 2, max: 10 },
    migrations: {
      tableName: 'knex_migrations',
      directory: './src/scripts/migrations',
      extension: 'ts',
    },
    seeds: {
      directory: './src/scripts/seeds',
    },
  },

  staging: {
    client: 'pg',
    connection: process.env.DATABASE_URL, // e.g., postgres://user:pass@localhost:5432/db
    pool: { min: 2, max: 10 },
    migrations: {
      tableName: 'knex_migrations',
      directory: './src/scripts/migrations',
      extension: 'ts',
    },
    seeds: {
      directory: './src/scripts/seeds',
    },
  },

  production: {
    client: 'pg',
    connection: process.env.DATABASE_URL, // e.g., postgres://user:pass@localhost:5432/db
    pool: { min: 2, max: 10 },
    migrations: {
      tableName: 'knex_migrations',
      directory: './src/scripts/migrations',
      extension: 'ts',
    },
    seeds: {
      directory: './src/scripts/seeds',
    },
  },

  // Optional: Add test, staging, production configs here
};

export default config;
