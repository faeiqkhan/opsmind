const { Client } = require('pg');

const config = {
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
};

const systemConfig = {
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: 'postgres', // system db for admin tasks
};

async function ensureDatabaseAndAdmin() {
  // 1. Connect to system db to check/create target db and admin role
  const sysClient = new Client(systemConfig);
  await sysClient.connect();

  // 2. Create database if not exists
  const dbName = process.env.DB_NAME;
  const adminUser = 'admin';
  const adminPass = 'pass';

  const dbExists = await sysClient.query(
    `SELECT 1 FROM pg_database WHERE datname = $1`, [dbName]
  );
  if (dbExists.rowCount === 0) {
    await sysClient.query(`CREATE DATABASE ${dbName}`);
    console.log(`Database '${dbName}' created.`);
  } else {
    console.log(`Database '${dbName}' already exists.`);
  }

  // 3. Create admin user if not exists
  const userExists = await sysClient.query(
    `SELECT 1 FROM pg_roles WHERE rolname = $1`, [adminUser]
  );
  if (userExists.rowCount === 0) {
    await sysClient.query(
      `CREATE ROLE ${adminUser} WITH SUPERUSER LOGIN PASSWORD '${adminPass}'`
    );
    console.log(`Admin user '${adminUser}' created.`);
  } else {
    console.log(`Admin user '${adminUser}' already exists.`);
  }

  await sysClient.end();

  // 4. Connect to target db to check/create tables
  const client = new Client(config);
  await client.connect();

  // 5. Create audit_logs table if not exists (updated schema)
  await client.query(`
    CREATE TABLE IF NOT EXISTS audit_logs (
      id SERIAL PRIMARY KEY,
      user_id TEXT,
      method TEXT,
      route TEXT,
      status_code INT,
      ip_address TEXT,
      metadata JSONB,
      created_at TIMESTAMPTZ DEFAULT NOW()
    )
  `);
  console.log('Table audit_logs ensured.');

  // Create files table if not exists
  await client.query(`
    CREATE TABLE IF NOT EXISTS files (
      id SERIAL PRIMARY KEY,
      filename TEXT,
      size BIGINT,
      user_id TEXT,
      access TEXT,
      uploaded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `);
  console.log('Table files ensured.');

  // Add more table checks/creations here as needed

  await client.end();
}

// Only run if called directly
if (require.main === module) {
  ensureDatabaseAndAdmin()
    .then(() => {
      console.log('Database and admin user ensured.');
      process.exit(0);
    })
    .catch((err) => {
      console.error('Error ensuring database/admin:', err);
      process.exit(1);
    });
}

module.exports = ensureDatabaseAndAdmin; 