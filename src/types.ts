import type { Context } from 'koa';

// State for Koa context
export interface AppState {
  jwt: {
    sub: string;
    iat: number;
    exp: number;
    aud?: string;
  };
}

// Application context type (extends Koa.Context)
export interface AppContext extends Context {
  state: AppState;
  sanitizedRequest: {
    params?: Record<string, unknown>;
    query?: Record<string, unknown>;
    body?: Record<string, unknown>;
  };
}

// Base HTTP controller function type
export type ControllerFunction = (ctx: AppContext, next?: () => Promise<void>) => Promise<void>;

// Database entity interfaces
export interface User {
  username: string;
  createdAt: number;
}

export interface Recipe {
  id: number;
  username: string;
  title: string;
  description?: string;
  ingredients: string[];
  instructions: string[];
  createdAt: number;
  updatedAt: number;
}

export interface News {
  id: number;
  title: string;
  content: string;
  recipeId?: number;
  createdAt: number;
}

export interface RecipeFavorite {
  id: number;
  username: string;
  recipeId: number;
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
