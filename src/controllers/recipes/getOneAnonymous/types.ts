/**
 * GET /anonymous/recipes/{slug} — Get a recipe by slug (no auth)
 */

import type { GetOneParam } from './schema.ts';
import type { RecipeEntity } from '../../../schemas/recipe.ts';

export type Input = GetOneParam;

export interface Output extends RecipeEntity {
  authorUsername: string;
}
