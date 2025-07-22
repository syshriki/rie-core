import * as z from 'zod/v4';
import { recipeSlug } from '../../../schemas/recipe.ts';

export const deleteFavoriteParam = z
  .object({
    slug: recipeSlug,
  })
  .strict();

export type DeleteFavoriteParams = z.infer<typeof deleteFavoriteParam>;
