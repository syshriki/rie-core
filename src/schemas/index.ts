/**
 * Root schema export file that consolidates all schemas
 */

import { z } from 'zod';
import newsSchemas from './news.ts';
import recipeSchemas from './recipe.ts';
import recipeFavoriteSchemas from './recipeFavorite.ts';
import userSchemas from './user.ts';

// Common pagination schema
export const paginationSchema = z.object({
  cursor: z.coerce.string().optional().nullable(),
  limit: z.coerce.number().int().positive().default(10).optional(),
});

export type PaginationQuery = z.infer<typeof paginationSchema>;

// Re-export all schemas
export * from './user.ts';
export * from './recipe.ts';
export * from './news.ts';
export * from './recipeFavorite.ts';

// Export default object with all schemas
export default {
  // Common schemas
  paginationSchema,

  // User schemas
  ...userSchemas,

  // Recipe schemas
  ...recipeSchemas,

  // News schemas
  ...newsSchemas,

  // Recipe Favorite schemas
  ...recipeFavoriteSchemas,
};
