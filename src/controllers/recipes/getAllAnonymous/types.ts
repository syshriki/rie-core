/**
 * GET /anonymous/recipes — Search and list recipes (no auth)
 */

import type { RecipeSearchQuery } from './schema.ts';
import type { RecipeEntity } from '../../../schemas/recipe.ts';

export type Input = RecipeSearchQuery;

export interface PaginationInfo {
  currentPage: number;
  pageSize: number;
  totalPages: number;
  totalItems: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

export interface CursorResponse {
  recipes: RecipeEntity[];
  hasMore: boolean;
  nextCursor: number | null;
}

export interface PageResponse {
  recipes: RecipeEntity[];
  pagination: PaginationInfo;
}

export type Output = CursorResponse | PageResponse;
