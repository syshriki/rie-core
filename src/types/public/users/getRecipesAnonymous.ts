/**
 * GET /anonymous/users/{authorId}/recipes — Get recipes by author (no auth)
 */

import type {
  GetUserRecipesParam,
  GetUserRecipesQuery,
} from '../../../controllers/users/getRecipesAnonymous/schema.ts';
import type { RecipeEntity } from '../../../schemas/recipe.ts';

export interface Input {
  params: GetUserRecipesParam;
  query: GetUserRecipesQuery;
}

export interface Output {
  recipes: RecipeEntity[];
  hasMore: boolean;
  nextCursor: number | null;
}
