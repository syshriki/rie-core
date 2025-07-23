import * as z from 'zod/v4';

export const createFavoriteParam = z
  .object({
    slug: z.string().min(2).max(100),
  })
  .strict();

export type CreateFavoriteParam = z.infer<typeof createFavoriteParam>;
