import * as z from 'zod/v4';

export const deleteUserParam = z.object({
  id: z.string(),
});

export type DeleteUserParams = z.infer<typeof deleteUserParam>;
