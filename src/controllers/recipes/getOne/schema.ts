import * as z from 'zod/v4';
import { recipeSlug } from '../../../schemas/index.ts';

export const getOneRecipeParamSchema = z
  .object({
    slug: recipeSlug,
  })
  .strict();

export type GetOneParam = z.infer<typeof getOneRecipeParamSchema>;
