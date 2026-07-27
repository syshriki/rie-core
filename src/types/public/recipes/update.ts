/**
 * PUT /recipes/{slug} — Update a recipe
 * Auth: Cookie
 */

import type {
  UpdateRecipeBody,
  UpdateRecipeParam,
} from '../../../controllers/recipes/update/schema.ts';
import type { RecipeEntity } from '../../../schemas/recipe.ts';

export interface Input {
  params: UpdateRecipeParam;
  body: UpdateRecipeBody;
}

export type Output = RecipeEntity;
