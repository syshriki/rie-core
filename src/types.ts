import type { Context } from 'koa';
import type Koa from 'koa';

export interface AppState {
  userId: string;
}

export interface ExtendedAppContext<
  P = never,
  Q = never,
  B = never,
> extends Context {
  sanitizedRequest: {
    params?: P;
    query?: Q;
    body?: B;
  };
}

export type AppContext<O = {}> = Koa.ParameterizedContext<
  AppState,
  ExtendedAppContext<
    O extends { Params: infer P } ? P : never,
    O extends { Query: infer Q } ? Q : never,
    O extends { ReqBody: infer B } ? B : never
  >,
  O extends { RespBody: infer R } ? R : unknown
>;

// Database entity interfaces
export interface User {
  username: string;
  createdAt: number;
}

// Generic pagination result type
export interface PaginatedResult<T> {
  hasMore: boolean;
  nextCursor: number | null;
  data: T[];
}

// Error interfaces
export interface AppError extends Error {
  status: number;
  details?: string | string[];
}
