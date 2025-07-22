import * as z from 'zod/v4';
import { recipeSlug } from '../../../schemas/index.ts';

export const createFavoriteParam = z
  .object({
    slug: recipeSlug,
  })
  .strict();

export type CreateFavoriteParam = z.infer<typeof createFavoriteParam>;
