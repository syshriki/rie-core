import * as z from 'zod/v4';

export const getOneRecipeParamSchema = z
  .object({
    slug: z.string().min(2).max(100),
  })
  .strict();

export type GetOneParam = z.infer<typeof getOneRecipeParamSchema>;
