/**
 * GET /recipes/{slug} — Get a recipe by slug
 * Auth: Cookie
 */

import type { GetOneParam } from '../../../controllers/recipes/getOne/schema.ts';
import type { RecipeEntity } from '../../../schemas/recipe.ts';

export type Input = GetOneParam;

export interface Output extends RecipeEntity {
  isFavorite: boolean;
  authorUsername: string;
}
