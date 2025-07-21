/**
 * Schema definitions for user-related data
 */

import * as z from 'zod/v4';
import { BadRequestError } from '../httpErrors.ts';

const username = z
  .string()
  .min(1)
  .max(100)
  .regex(/^[a-zA-Z0-9_-\s]+$/, {
    error: () => {
      throw new BadRequestError(
        `'name' must only contain A-Z a-z 0-9 underscores dashes and spaces`,
        'SPECIAL_CHARS',
      );
    },
  });

// Output schema for database user entity
export const userEntitySchema = z
  .object({
    username,
    createdAt: z.number().int(),
  })
  .strict();

// Input schema for user creation
export const userCreateInputSchema = z
  .object({
    id: z.number().int(),
    username: username.optional(),
  })
  .strict();

// Output schema for user profile response
export const userProfileOutputSchema = userEntitySchema
  .extend({
    isCurrentUser: z.boolean(),
  })
  .strict();

// Infer TypeScript types from schemas
export type UserEntity = z.infer<typeof userEntitySchema>;
export type UserCreateInput = z.infer<typeof userCreateInputSchema>;
export type UserProfileOutput = z.infer<typeof userProfileOutputSchema>;

export default {
  userEntitySchema,
  userCreateInputSchema,
  userProfileOutputSchema,
};
