import * as z from 'zod/v4';
import { paginationSchema } from '../../../schemas/pagination.ts';

export const getUserFavoritesParam = z
  .object({
    id: z.string(),
  })
  .strict();

export const getUserFavoritesQuery = paginationSchema;

export type GetUserFavoritesParams = z.infer<typeof getUserFavoritesParam>;
export type GetUserFavoritesQuery = z.infer<typeof getUserFavoritesQuery>;
