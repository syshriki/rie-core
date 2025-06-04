/**
 * Schema definitions for news-related data
 */

import { z } from 'zod';

// Base news schema
const newsBaseSchema = z.object({
  title: z.string().min(1, 'Title is required').max(100, 'Title must not exceed 100 characters'),
  content: z.string().min(1, 'Content is required'),
});

// Output schema for database news entity
export const newsEntitySchema = newsBaseSchema.extend({
  id: z.number().int(),
  recipeId: z.number().int().optional(),
  createdAt: z.number().int(),
});

// Input schema for news creation
export const newsCreateInputSchema = newsBaseSchema.extend({
  recipeId: z.number().int().optional(),
});

// Output schema for news response
export const newsOutputSchema = newsEntitySchema;

// Output schema for multiple news response
export const newsListOutputSchema = z.object({
  hasMore: z.boolean(),
  nextCursor: z.number().int().nullable(),
  news: z.array(newsOutputSchema),
});

// Schema for news ID param
export const newsIdParamSchema = z.object({
  id: z.coerce.number().int().positive('News ID must be a positive integer'),
});

// Schema for news search query params
export const newsSearchQuerySchema = z.object({
  recipeId: z.coerce.number().int().optional(),
  cursor: z.coerce.number().int().optional().nullable(),
  limit: z.coerce.number().int().positive().default(10).optional(),
});

// Infer TypeScript types from schemas
export type NewsEntity = z.infer<typeof newsEntitySchema>;
export type NewsCreateInput = z.infer<typeof newsCreateInputSchema>;
export type NewsOutput = z.infer<typeof newsOutputSchema>;
export type NewsListOutput = z.infer<typeof newsListOutputSchema>;
export type NewsIdParam = z.infer<typeof newsIdParamSchema>;
export type NewsSearchQuery = z.infer<typeof newsSearchQuerySchema>;

export default {
  newsEntitySchema,
  newsCreateInputSchema,
  newsOutputSchema,
  newsListOutputSchema,
  newsIdParamSchema,
  newsSearchQuerySchema,
};
