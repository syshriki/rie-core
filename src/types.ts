import type { Context } from 'koa';
import type Koa from 'koa';

export interface AppState {
  userId: string;
}

export interface ExtendedAppContext extends Context {
  sanitizedRequest: {
    params?: object;
    query?: object;
    body?: object;
  };
}

export type AppContext = Koa.ParameterizedContext<AppState, ExtendedAppContext>;

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
