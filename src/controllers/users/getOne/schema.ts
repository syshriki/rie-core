import * as z from 'zod/v4';

export const getOneUserParam = z
  .object({
    id: z.coerce.number().int(),
  })
  .strict();

export type GetOneUserParams = z.infer<typeof getOneUserParam>;
