import type { AppError } from './types.ts';

export class BaseError extends Error implements AppError {
  status: number;
  code?: string;

  constructor(message: string, status = 500, code?: string) {
    super(message);
    this.name = this.constructor.name;
    this.status = status;
    this.code = code;

    // This is needed for extending built-in classes in TypeScript/ES6
    Object.setPrototypeOf(this, new.target.prototype);
  }
}

export class BadRequestError extends BaseError {
  constructor(message = 'Bad request', code?: string) {
    super(message, 400, code);
  }
}

export class UnauthorizedError extends BaseError {
  constructor(message = 'Unauthorized', code?: string) {
    super(message, 401, code);
  }
}

export class ForbiddenError extends BaseError {
  constructor(message = 'Forbidden', code?: string) {
    super(message, 403, code);
  }
}

export class NotFoundError extends BaseError {
  constructor(message = 'Not found', code?: string) {
    super(message, 404, code);
  }
}

export class ConflictError extends BaseError {
  constructor(message = 'Resource conflict', code?: string) {
    super(message, 409, code);
  }
}

export class UnprocessableEntityError extends BaseError {
  constructor(message = 'Unprocessable entity', code?: string) {
    super(message, 422, code);
  }
}

export class InternalServerError extends BaseError {
  constructor(message = 'Internal server error', code?: string) {
    super(message, 500, code);
  }
}

// Export all error classes
export default {
  BaseError,
  BadRequestError,
  UnauthorizedError,
  ForbiddenError,
  NotFoundError,
  ConflictError,
  UnprocessableEntityError,
  InternalServerError,
};
