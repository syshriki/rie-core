import * as z from 'zod/v4';

export const paginationSchema = z.object({
  cursor: z.coerce.string().optional().nullable(),
  limit: z.coerce.number().int().positive().default(10).optional(),
});
