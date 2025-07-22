import type * as z from 'zod/v4';
import { recipeBaseSchema } from '../../../schemas/recipe.ts';

export const createRecipeBody = recipeBaseSchema.strict();

export type CreateRecipeBody = z.infer<typeof createRecipeBody>;
