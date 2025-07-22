import * as z from 'zod/v4';

export const recipeSchemaQuery = z
  .object({
    q: z.string().optional().default(''),
    cursor: z.coerce.date().optional(),
    limit: z.coerce.number().int().positive().default(10),
  })
  .strict();

export type RecipeSearchQuery = z.infer<typeof recipeSchemaQuery>;
