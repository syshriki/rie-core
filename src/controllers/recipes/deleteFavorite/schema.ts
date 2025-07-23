import * as z from 'zod/v4';

export const deleteFavoriteParam = z
  .object({
    slug: z.string().min(2).max(100),
  })
  .strict();

export type DeleteFavoriteParams = z.infer<typeof deleteFavoriteParam>;
