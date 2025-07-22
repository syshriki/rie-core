import * as z from 'zod/v4';
import { recipeSlug } from '../../../schemas/recipe.ts';

export const deleteRecipeParam = z
  .object({
    slug: recipeSlug,
  })
  .strict();

export type DeleteRecipeParams = z.infer<typeof deleteRecipeParam>;
