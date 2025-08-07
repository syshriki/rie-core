import * as z from 'zod/v4';

export const paginationSchema = z.object({
  cursor: z.coerce.string().optional().nullable(),
  pageSize: z.coerce.number().int().positive().max(100).default(10).optional(),
});
