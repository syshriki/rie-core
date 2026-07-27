/**
 * GET /users/{id}/recipes — Get recipes authored by a user
 * Auth: Cookie
 */

import type {
  GetUserRecipesParam,
  GetUserRecipesQuery,
} from '../../../controllers/users/getRecipes/schema.ts';
import type { RecipeSearchEntity } from '../../../schemas/recipe.ts';

export interface Input {
  params: GetUserRecipesParam;
  query: GetUserRecipesQuery;
}

export interface Output {
  recipes: RecipeSearchEntity[];
  hasMore: boolean;
  nextCursor: number | null;
}
