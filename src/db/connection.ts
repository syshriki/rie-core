import config from 'config';
import { pino } from 'pino';
import postgres from 'postgres';

let sql: postgres.Sql;
const logger = pino();

const createSqlClient = () => {
  const user = config.get<string>('db.user');
  const password = config.get<string>('db.password');
  const host = config.get<string>('db.host');
  const port = config.get<number>('db.port');
  const database = config.get<string>('db.database');

  logger.info(`connecting to postgres at ${host}:${port}/${database} as user ${user}`);

  const connectionString = `postgresql://${user}:${password}@${host}:${port}/${database}`;

  sql = postgres(connectionString, {
    max: 10,
    idle_timeout: 30000,
    connection: {
      application_name: 'rie-auth',
    },
    //debug: console.log,
    transform: {
      ...postgres.toCamel,
      undefined: null,
    },
  });

  return sql;
};

export { createSqlClient, sql };
