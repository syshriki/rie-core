/**
 * Validation middleware for request params, body, and query
 * Uses Zod schemas to validate incoming request data
 */

import { z } from 'zod';
import { UnprocessableEntityError } from '../errors.ts';
import type { AppContext, ControllerFunction } from '../types.ts';

/**
 * Validates request body against a given schema
 *
 * @param schema - Zod schema to validate against
 * @returns Middleware function that validates request body
 */
export function body<T extends z.ZodType>(schema: T): ControllerFunction {
  return async (ctx: AppContext, next: () => Promise<void>) => {
    try {
      const validatedData = await schema.parseAsync(ctx.request.body);
      ctx.state.validatedBody = validatedData;
      return next();
    } catch (error) {
      if (error instanceof z.ZodError) {
        // Format the error messages
        const details = error.errors.map((err) => `${err.path.join('.')}: ${err.message}`);
        throw new UnprocessableEntityError('Invalid request body', details);
      }
      throw error;
    }
  };
}

/**
 * Validates URL query parameters against a given schema
 *
 * @param schema - Zod schema to validate against
 * @returns Middleware function that validates query parameters
 */
export function query<T extends z.ZodType>(schema: T): ControllerFunction {
  return async (ctx: AppContext, next: () => Promise<void>) => {
    try {
      const validatedData = await schema.parseAsync(ctx.request.query);
      ctx.state.validatedQuery = validatedData;
      return next();
    } catch (error) {
      if (error instanceof z.ZodError) {
        const details = error.errors.map((err) => `${err.path.join('.')}: ${err.message}`);
        throw new UnprocessableEntityError('Invalid query parameters', details);
      }
      throw error;
    }
  };
}

/**
 * Validates URL path parameters against a given schema
 *
 * @param schema - Zod schema to validate against
 * @returns Middleware function that validates path parameters
 */
export function params<T extends z.ZodType>(schema: T): ControllerFunction {
  return async (ctx: AppContext, next: () => Promise<void>) => {
    try {
      const validatedData = await schema.parseAsync(ctx.params);
      ctx.state.validatedParams = validatedData;
      return next();
    } catch (error) {
      if (error instanceof z.ZodError) {
        const details = error.errors.map((err) => `${err.path.join('.')}: ${err.message}`);
        throw new UnprocessableEntityError('Invalid path parameters', details);
      }
      throw error;
    }
  };
}
