import type { Context } from 'koa';

// State for Koa context
export interface AppState {
  user?: {
    username: string;
  };
  jwt?: {
    sub: string; // Subject (user ID)
    iat: number; // Issued at
    exp: number; // Expiration time
    aud?: string; // Audience
  };
  validatedBody?: Record<string, unknown>;
  validatedQuery?: Record<string, unknown>;
  validatedParams?: Record<string, unknown>;
}

// Application context type (extends Koa.Context)
export interface AppContext extends Context {
  state: AppState;
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
