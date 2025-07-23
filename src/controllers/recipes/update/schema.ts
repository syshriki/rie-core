import * as z from 'zod/v4';
import { recipeBaseSchema } from '../../../schemas/recipe.ts';

export const updateRecipeBodySchema = recipeBaseSchema.strict();

export const updateRecipeParamSchema = z
  .object({
    slug: z.string().min(2).max(100),
  })
  .strict();

export type UpdateRecipeParam = z.infer<typeof updateRecipeParamSchema>;

export type UpdateRecipeBody = z.infer<typeof updateRecipeBodySchema>;
