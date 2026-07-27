import type { Next } from 'koa';
import type { ZodObject } from 'zod/v4';
import type { AppContext } from '../types.ts';

interface ValidationSchema {
  body?: ZodObject;
  query?: ZodObject;
  params?: ZodObject;
}

export default (schema: ValidationSchema) => {
  return async (ctx: AppContext, next: Next): Promise<void> => {
    const req = ctx.sanitizedRequest as Record<string, unknown>;
    req.params = undefined;
    req.query = undefined;
    req.body = undefined;
    ctx.log.debug({ body: ctx.request.body, query: ctx.query, params: ctx.params });
    if (schema.params) {
      req.params = schema.params.parse(ctx.params);
    }
    if (schema.query) {
      req.query = schema.query.parse(ctx.query);
    }
    if (schema.body) {
      req.body = schema.body.parse(ctx.request.body);
    }
    await next();
  };
};
