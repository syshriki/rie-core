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
    ctx.sanitizedRequest = {};
    ctx.log.debug({ body: ctx.request.body, query: ctx.query, params: ctx.params });
    if (schema.params) {
      ctx.sanitizedRequest.params = schema.params.parse(ctx.params);
    }
    if (schema.query) {
      ctx.sanitizedRequest.query = schema.query.parse(ctx.query);
    }
    if (schema.body) {
      ctx.sanitizedRequest.body = schema.body.parse(ctx.request.body);
    }
    await next();
  };
};
