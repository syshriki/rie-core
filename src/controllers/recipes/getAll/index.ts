/**
 * Get all recipes with pagination and search
 */

import * as recipeDao from '../../../db/daos/recipeDao.ts';
import type { AppContext } from '../../../types.ts';
import type { RecipeSearchQuery } from './schema.ts';

export default async (ctx: AppContext): Promise<void> => {
  const { q, cursor, limit } = ctx.sanitizedRequest.query as RecipeSearchQuery;

  const { userId } = ctx.state;

  const rawRecipes = await recipeDao.search(q, userId, cursor, limit + 1);

  const hasMore = rawRecipes.length > limit;
  if (hasMore) {
    rawRecipes.pop();
  }

  const nextCursor = hasMore ? rawRecipes[rawRecipes.length - 1].createdAt : null;

  ctx.body = {
    recipes: rawRecipes,
    hasMore,
    nextCursor,
  };
};
