import type { Next } from 'koa';
import type { AppContext } from '../types.ts';

export default async function errorHandler(ctx: AppContext, next: Next) {
  try {
    await next();
  } catch (err: any) {
    const isUnexpected = err.status >= 500 || !err.status;
    const is4xx = err.status >= 400 && err.status < 500;

    if (isUnexpected) {
      ctx.log.error({"path": ctx.path, "msg":err.stack});
    }

    if (is4xx) {
      ctx.log.warn({"path": ctx.path, "msg":err.message});
    }
    ctx.status = isUnexpected ? 500 : err.status;
    ctx.body = {
      message: isUnexpected ? '' : err.message,
      code: err.code,
    };
  }
}
