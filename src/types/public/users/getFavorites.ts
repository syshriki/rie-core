/**
 * GET /users/{id}/favorites — Get a user's favorited recipes
 * Auth: Cookie
 */

import type {
  GetUserFavoritesParams,
  GetUserFavoritesQuery,
} from '../../../controllers/users/getFavorites/schema.ts';
import type { RecipeWithFavorite } from '../../../schemas/recipe.ts';

export interface Input {
  params: GetUserFavoritesParams;
  query: GetUserFavoritesQuery;
}

export interface Output {
  recipes: RecipeWithFavorite[];
  hasMore: boolean;
  nextCursor: number | null;
}
