/**
 * Schema definitions for user-related data
 */

import { z } from 'zod';

// Output schema for database user entity
export const userEntitySchema = z.object({
  username: z.string().min(1).max(20),
  createdAt: z.number().int(),
});

// Input schema for user creation
export const userCreateInputSchema = z.object({
  username: z
    .string()
    .min(1, 'Username is required')
    .max(20, 'Username must not exceed 20 characters'),
});

// Output schema for user profile response
export const userProfileOutputSchema = userEntitySchema.extend({
  isCurrentUser: z.boolean(),
});

// Infer TypeScript types from schemas
export type UserEntity = z.infer<typeof userEntitySchema>;
export type UserCreateInput = z.infer<typeof userCreateInputSchema>;
export type UserProfileOutput = z.infer<typeof userProfileOutputSchema>;

export default {
  userEntitySchema,
  userCreateInputSchema,
  userProfileOutputSchema,
};
