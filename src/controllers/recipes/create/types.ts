/**
 * POST /recipes — Create a new recipe
 * Auth: Cookie
 */

import type { CreateRecipeBody } from './schema.ts';
import type { RecipeEntity } from '../../../schemas/recipe.ts';

export type Input = CreateRecipeBody;
export type Output = RecipeEntity;
