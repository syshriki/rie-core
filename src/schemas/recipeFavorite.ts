/**
 * Schema definitions for recipe favorite-related data
 */

import * as z from 'zod/v4';
import { recipeOutputSchema } from './recipe.ts';

// Output schema for database recipe favorite entity
export const recipeFavoriteEntitySchema = z.object({
  id: z.number().int(),
  username: z.string(),
  recipeId: z.number().int(),
  createdAt: z.number().int(),
});

// Input schema for adding a recipe favorite
export const recipeFavoriteInputSchema = z.object({
  recipeId: z.number().int(),
});

// Output schema for user's favorite recipes
export const userFavoritesOutputSchema = z.object({
  hasMore: z.boolean(),
  nextCursor: z.number().int().nullable(),
  recipes: z.array(recipeOutputSchema),
});

// Schema for favorite search query params
export const favoriteSearchQuerySchema = z.object({
  cursor: z.coerce.number().int().optional().nullable(),
  limit: z.coerce.number().int().positive().default(10).optional(),
});

// Infer TypeScript types from schemas
export type RecipeFavoriteEntity = z.infer<typeof recipeFavoriteEntitySchema>;
export type RecipeFavoriteInput = z.infer<typeof recipeFavoriteInputSchema>;
export type UserFavoritesOutput = z.infer<typeof userFavoritesOutputSchema>;
export type FavoriteSearchQuery = z.infer<typeof favoriteSearchQuerySchema>;

export default {
  recipeFavoriteEntitySchema,
  recipeFavoriteInputSchema,
  userFavoritesOutputSchema,
  favoriteSearchQuerySchema,
};
