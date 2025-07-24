import * as z from 'zod/v4';
import { paginationSchema } from '../../../schemas/pagination.ts';

export const getUserRecipesParamSchema = z.object({
  id: z.coerce.number().int(),
});

export const getUserRecipesQuerySchema = paginationSchema;

export type GetUserRecipesParam = z.infer<typeof getUserRecipesParamSchema>;
export type GetUserRecipesQuery = z.infer<typeof getUserRecipesQuerySchema>;
