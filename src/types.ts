import type { Context } from 'koa';
import type Koa from 'koa';

export interface AppState {
  userId: number;
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
