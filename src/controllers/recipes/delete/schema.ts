import * as z from 'zod/v4';

export const deleteRecipeParam = z
  .object({
    slug: z.string().min(2).max(100),
  })
  .strict();

export type DeleteRecipeParams = z.infer<typeof deleteRecipeParam>;
