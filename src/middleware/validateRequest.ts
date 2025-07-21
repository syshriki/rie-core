import type { Context, Next } from 'koa';
import type { ZodObject } from 'zod/v4';

interface ValidationSchema {
  body?: ZodObject;
  query?: ZodObject;
  params?: ZodObject;
}

export default (schema: ValidationSchema) => {
  return async (ctx: Context, next: Next): Promise<void> => {
    ctx.sanitizedRequest = {} as ValidationSchema;
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
