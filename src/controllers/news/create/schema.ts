/**
 * Schema for news creation endpoint
 */
import * as z from 'zod/v4';

export const createNewsSchema = z.object({
  title: z.string().min(1).max(100),
  text: z.string().min(1).max(500),
  type: z.string().min(1).max(100),
  recipeSlug: z.string().nullable().optional(),
});

export type CreateNewsBody = z.infer<typeof createNewsSchema>;
