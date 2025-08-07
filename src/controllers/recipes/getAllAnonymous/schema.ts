import * as z from 'zod/v4';
import { BadRequestError } from '../../../httpErrors.ts';

export const recipeSchemaQuery = z
  .object({
    q: z.string().optional().default(''),
    cursor: z.coerce.date().optional(),
    page: z.coerce.number().int().positive().optional(),
    pageSize: z.coerce.number().int().positive().max(100).default(10),
  })
  .strict()
  .refine(
    (data) => {
      // Ensure that cursor and page are not used together
      return !(data.cursor !== undefined && data.page !== undefined);
    },
    {
      error: () => {
        throw new BadRequestError(
          'cannot use both cursor and page-based pagination in the same request, use either cursor or page',
          'BAD_PAGINATION_PARAMS',
        );
      },
    },
  );

export type RecipeSearchQuery = z.infer<typeof recipeSchemaQuery>;
