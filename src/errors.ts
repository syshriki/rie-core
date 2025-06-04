/**
 * Custom error classes
 */

import type { AppError } from './types.ts';

/**
 * Base application error class
 */
export class BaseError extends Error implements AppError {
  status: number;
  details?: string | string[];

  constructor(message: string, status = 500, details?: string | string[]) {
    super(message);
    this.name = this.constructor.name;
    this.status = status;
    this.details = details;

    // This is needed for extending built-in classes in TypeScript/ES6
    Object.setPrototypeOf(this, new.target.prototype);
  }
}

/**
 * 400 Bad Request error
 */
export class BadRequestError extends BaseError {
  constructor(message = 'Bad request', details?: string | string[]) {
    super(message, 400, details);
  }
}

/**
 * 401 Unauthorized error
 */
export class UnauthorizedError extends BaseError {
  constructor(message = 'Unauthorized', details?: string | string[]) {
    super(message, 401, details);
  }
}

/**
 * 403 Forbidden error
 */
export class ForbiddenError extends BaseError {
  constructor(message = 'Forbidden', details?: string | string[]) {
    super(message, 403, details);
  }
}

/**
 * 404 Not Found error
 */
export class NotFoundError extends BaseError {
  constructor(message = 'Not found', details?: string | string[]) {
    super(message, 404, details);
  }
}

/**
 * 409 Conflict error
 */
export class ConflictError extends BaseError {
  constructor(message = 'Resource conflict', details?: string | string[]) {
    super(message, 409, details);
  }
}

/**
 * 422 Unprocessable Entity error
 */
export class ValidationError extends BaseError {
  constructor(message = 'Validation error', details?: string | string[]) {
    super(message, 422, details);
  }
}

/**
 * 500 Internal Server Error
 */
export class InternalServerError extends BaseError {
  constructor(message = 'Internal server error', details?: string | string[]) {
    super(message, 500, details);
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
  ValidationError,
  InternalServerError,
};
