import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import config from 'config';
import postgres from 'postgres';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const createSqlClient = () => {
  const user = config.get<string>('db.user');
  const password = config.get<string>('db.password');
  const host = config.get<string>('db.host');
  const port = config.get<number>('db.port');
  const database = config.get<string>('db.database');
  const connectionString = `postgresql://${user}:${password}@${host}:${port}/${database}`;

  return postgres(connectionString, {
    max: 10,
    idle_timeout: 30000,
    transform: {
      ...postgres.toCamel,
      undefined: null,
    },
  });
};

export async function reinitializeDatabase(): Promise<void> {
  const sql = await createSqlClient();
  try {
    const schemaPath = path.resolve(__dirname, '../../sql/schema.sql');
    const schema = fs.readFileSync(schemaPath, 'utf8');

    await sql.unsafe(schema);
  } catch (error) {
    console.error('Error initializing database schema:', error);
    throw error;
  } finally {
    await sql.end();
    console.log('db cleaned');
  }
}
