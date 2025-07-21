import * as errors from '../httpErrors.ts';

interface ErrorHandlerOptions {
  message?: string;
  code?: string;
  constraint?: string;
  ignore?: boolean;
}

type PostgresError = {
  code: string;
  constraint_name?: string;
  detail?: string;
};

export function duplicateKeyErrorHandler({
  message,
  code,
  constraint,
  ignore = false,
}: ErrorHandlerOptions): (error: PostgresError) => undefined {
  return (error: PostgresError) => {
    if (error.code === '23505' && (!constraint || error.constraint_name === constraint)) {
      if (ignore) {
        return;
      }
      throw new errors.ConflictError(message ?? error.detail, code);
    }
    throw error;
  };
}

export function foreignKeyErrorHandler({
  message,
  code,
  constraint,
  ignore = false,
}: ErrorHandlerOptions): (error: PostgresError) => undefined {
  return (error: PostgresError) => {
    if (error.code === '23503' && (!constraint || error.constraint_name === constraint)) {
      if (ignore) {
        return;
      }
      throw new errors.BadRequestError(message ?? error.detail, code);
    }
    throw error;
  };
}
