import type postgres from 'postgres';
import * as errors from '../errors.ts';
import { sql } from './db.ts';

export function optionalTransaction<T, Args extends unknown[]>(
  fn: (sql: postgres.TransactionSql, ...args: Args) => Promise<T>
) {
  return async (sqlInstance: postgres.Sql | null = null, ...args: Args): Promise<T> => {
    if (sqlInstance) {
      return fn(sqlInstance as postgres.TransactionSql, ...args);
    }

    const result = await sql.begin(async (transactionSql) => {
      return await fn(transactionSql, ...args);
    });
    return result as unknown as T;
  };
}

interface ErrorHandlerOptions {
  message?: string;
  code?: string;
  constraint?: string;
}

type PostgresError = {
  code: string;
  constraint_name?: string;
  detail?: string;
};

export function duplicateKeyErrorHandler({ message, code, constraint }: ErrorHandlerOptions) {
  return (error: PostgresError) => {
    if (error.code === '23505' && (!constraint || error.constraint_name === constraint)) {
      throw new errors.BadRequestError(message ?? error.detail, code);
    }
    throw error;
  };
}

export function foreignKeyErrorHandler({ message, code, constraint }: ErrorHandlerOptions) {
  return (error: PostgresError) => {
    if (error.code === '23503' && (!constraint || error.constraint_name === constraint)) {
      throw new errors.BadRequestError(message ?? error.detail, code);
    }
    throw error;
  };
}
