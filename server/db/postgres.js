const { Pool } = require('pg');

const databaseUrl = process.env.DATABASE_URL;

const pool = databaseUrl
  ? new Pool({
      connectionString: databaseUrl,
      ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: true } : false
    })
  : null;

async function query(text, params = []) {
  if (!pool) {
    throw new Error('DATABASE_URL is not configured for PostgreSQL auth storage');
  }

  return pool.query(text, params);
}

module.exports = {
  pool,
  query
};
