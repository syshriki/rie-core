import * as z from 'zod/v4';

export const updateUserBodySchema = z
  .object({
    username: z
      .string()
      .min(1)
      .max(100)
      .regex(/^[a-zA-Z0-9_\-\s]+$/),
  })
  .strict();

export type UpdateUserBody = z.infer<typeof updateUserBodySchema>;
