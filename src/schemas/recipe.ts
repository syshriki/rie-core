import * as z from 'zod/v4';
import { BadRequestError } from '../httpErrors.ts';

export const recipeSlug = z
  .string()
  .min(1)
  .max(100)
  .regex(/^[a-zA-Z0-9_]+$/, {
    error: () => {
      throw new BadRequestError(
        'slug can only contain letters, numbers and underscores',
        'SPECIAL_CHARS',
      );
    },
  });

export const recipeBaseSchema = z.object({
  title: z
    .string()
    .min(1)
    .max(100)
    .regex(/^[a-zA-Z0-9_\-\s\/,'&:.!()]+$/, {
      error: () => {
        throw new BadRequestError(
          "title can only contain letters, numbers, spaces, and common punctuation (,&:.-_/'!())",
          'SPECIAL_CHARS',
        );
      },
    }),
  description: z.string().max(500).optional(),
  ingredients: z.string().optional(),
  recipe: z.string(),
});

// Output schema for database recipe entity
export const recipeEntitySchema = recipeBaseSchema.extend({
  id: z.number().int(),
  slug: recipeSlug,
  authorId: z.string(),
  createdAt: z.number().int(),
  updatedAt: z.number().int(),
});

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

export type RecipeEntity = z.infer<typeof recipeEntitySchema>;

export type RecipeWithFavorite = z.infer<typeof recipeOutputSchema>;

export type RecipeWAuthorEntity = RecipeWithFavorite & { authorUsername: string };

export type CreateRecipeInput = z.infer<typeof recipeBaseSchema> & {
  authorId: string;
  slug: string;
};
export type RecipeSearchEntity = RecipeWithFavorite;
export type RecipesOutput = z.infer<typeof recipesOutputSchema>;
export type RecipeIdParam = z.infer<typeof recipeIdParamSchema>;

export default {
  recipeEntitySchema,
  recipeOutputSchema,
  recipesOutputSchema,
  recipeIdParamSchema,
};
