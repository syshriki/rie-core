import * as z from 'zod/v4';

// Base recipe schema
const recipeBaseSchema = z.object({
  title: z.string().min(1, 'Title is required').max(100, 'Title must not exceed 100 characters'),
  description: z.string().max(500, 'Description must not exceed 500 characters').optional(),
  ingredients: z.array(z.string()).min(1, 'At least one ingredient is required'),
  instructions: z.array(z.string()).min(1, 'At least one instruction is required'),
});

// Output schema for database recipe entity
export const recipeEntitySchema = recipeBaseSchema.extend({
  id: z.number().int(),
  username: z.string(),
  createdAt: z.number().int(),
  updatedAt: z.number().int(),
});

// Input schema for recipe creation
export const recipeCreateInputSchema = recipeBaseSchema;

// Input schema for recipe update
export const recipeUpdateInputSchema = recipeBaseSchema.partial();

// Output schema for single recipe response
export const recipeOutputSchema = recipeEntitySchema.extend({
  isFavorite: z.boolean(),
});

// Output schema for multiple recipes response
export const recipesOutputSchema = z.object({
  hasMore: z.boolean(),
  nextCursor: z.number().int().nullable(),
  recipes: z.array(recipeOutputSchema),
});

// Schema for recipe ID param
export const recipeIdParamSchema = z.object({
  id: z.coerce.number().int().positive('Recipe ID must be a positive integer'),
});

// Schema for recipe search query params
export const recipeSearchQuerySchema = z.object({
  q: z.string().optional().default(''),
  cursor: z.coerce.number().int().optional().nullable(),
  limit: z.coerce.number().int().positive().default(10).optional(),
});

export type RecipeEntity = z.infer<typeof recipeEntitySchema>;
export type RecipeCreateInput = z.infer<typeof recipeCreateInputSchema>;
export type RecipeUpdateInput = z.infer<typeof recipeUpdateInputSchema>;
export type RecipeOutput = z.infer<typeof recipeOutputSchema>;
export type RecipesOutput = z.infer<typeof recipesOutputSchema>;
export type RecipeIdParam = z.infer<typeof recipeIdParamSchema>;
export type RecipeSearchQuery = z.infer<typeof recipeSearchQuerySchema>;

export default {
  recipeEntitySchema,
  recipeCreateInputSchema,
  recipeUpdateInputSchema,
  recipeOutputSchema,
  recipesOutputSchema,
  recipeIdParamSchema,
  recipeSearchQuerySchema,
};
