import config from 'config';
import * as jose from 'jose';
import type { Context, Next } from 'koa';

const JWKS = jose.createRemoteJWKSet(new URL(config.get<string>('auth.jwksUri')));

export default async (ctx: Context, next: Next) => {
  try {
    const token = ctx.cookies.get('auth_token');

    ctx.assert(token, 401, 'auth_token is required');

    const { payload, protectedHeader } = await jose.jwtVerify(token, JWKS, {
      issuer: config.get<string>('auth.issuer'),
      audience: config.get<string>('auth.audience'),
    });

    ctx.state.jwt = payload;
    await next();
  } catch (error) {
    if (error instanceof jose.errors.JWTExpired) {
      ctx.status = 401;
      ctx.body = { message: 'token expired' };
    } else if (error instanceof jose.errors.JWTInvalid) {
      ctx.status = 401;
      ctx.body = { message: 'invalid token' };
    }
    throw error;
  }
};
