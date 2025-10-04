import fs from 'fs/promises';
import mysql from 'mysql2/promise';
import 'dotenv/config';

async function run() {
  const file = process.argv[2];
  if (!file) {
    console.error('Uso: node scripts/apply-sql.js <ruta-del-sql>');
    process.exit(1);
  }

  const { DB_HOST, DB_PORT = '3306', DB_USER, DB_PASSWORD, DB_NAME } = process.env;
  if (!DB_HOST || !DB_USER || !DB_PASSWORD || !DB_NAME) {
    console.error('Faltan variables en .env (DB_HOST, DB_USER, DB_PASSWORD, DB_NAME)');
    process.exit(1);
  }

  const sql = await fs.readFile(file, 'utf8');
  const conn = await mysql.createConnection({
    host: DB_HOST,
    port: Number(DB_PORT),
    user: DB_USER,
    password: DB_PASSWORD,
    database: DB_NAME,
    multipleStatements: true,
  });

  try {
    console.log(`▶ Ejecutando ${file} en ${DB_HOST}:${DB_PORT}/${DB_NAME}`);
    await conn.query(sql);
    console.log('✅ Listo.');
  } finally {
    await conn.end();
  }
}

run().catch(err => {
  console.error('❌ Error:', err.message);
  process.exit(1);
});
