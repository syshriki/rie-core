import config from 'config';
import * as jose from 'jose';
import type { Context, Next } from 'koa';

const JWKS = jose.createRemoteJWKSet(new URL(config.get<string>('auth.jwksUri')));

interface AuthOptions {
  useAuthorizationHeader?: boolean;
}

function getTokenFromHeader(ctx: Context): string | undefined {
  const authHeader = ctx.headers.authorization;
  if (authHeader?.startsWith('Bearer ')) {
    return authHeader.substring(7);
  }
  return undefined;
}

function getTokenFromCookie(ctx: Context): string | undefined {
  return ctx.cookies.get('auth_token');
}

export function createAuthMiddleware(options: AuthOptions = {}) {
  return async (ctx: Context, next: Next) => {
    try {
      const token = options.useAuthorizationHeader
        ? getTokenFromHeader(ctx)
        : getTokenFromCookie(ctx);

      ctx.assert(
        token,
        401,
        options.useAuthorizationHeader
          ? 'Authorization header with Bearer token is required'
          : 'auth_token is required',
      );

      const { payload } = await jose.jwtVerify(token, JWKS, {
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
}
