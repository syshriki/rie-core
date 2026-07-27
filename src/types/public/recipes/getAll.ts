/**
 * GET /recipes — Search and list recipes
 * Auth: Cookie
 */

import type { RecipeSearchQuery } from '../../../controllers/recipes/getAll/schema.ts';
import type { RecipeWithFavorite } from '../../../schemas/recipe.ts';

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
  recipes: RecipeWithFavorite[];
  hasMore: boolean;
  nextCursor: number | null;
}

export interface PageResponse {
  recipes: RecipeWithFavorite[];
  pagination: PaginationInfo;
}

export type Output = CursorResponse | PageResponse;
