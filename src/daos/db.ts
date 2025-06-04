import config from 'config';
import postgres from 'postgres';

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

export const sql = createSqlClient();

