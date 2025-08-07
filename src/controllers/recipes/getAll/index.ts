/**
 * Get all recipes with pagination and search
 */

import * as recipeDao from '../../../db/daos/recipeDao.ts';
import type { AppContext } from '../../../types.ts';
import type { RecipeSearchQuery } from './schema.ts';

export default async (ctx: AppContext): Promise<void> => {
  const { q, cursor, page, pageSize } = ctx.sanitizedRequest.query as RecipeSearchQuery;

  const { userId } = ctx.state;

  // If page-based pagination is requested
  if (page !== undefined) {
    const rawRecipes = await recipeDao.pageSearch(q, userId, page, pageSize);

    // For page-based pagination, we need to get the total count for calculating total pages
    const recipeCount = await recipeDao.getRecipeCount(q, userId);
    const totalCount = recipeCount;
    const totalPages = Math.ceil(recipeCount / pageSize);

    ctx.body = {
      recipes: rawRecipes,
      pagination: {
        currentPage: page,
        pageSize: pageSize,
        totalPages: totalPages,
        totalItems: totalCount,
        hasNextPage: page < totalPages,
        hasPreviousPage: page > 1,
      },
    };
    return;
  }

  // Default cursor-based pagination
  const rawRecipes = await recipeDao.cursorSearch(q, userId, pageSize + 1, cursor);

  const hasMore = rawRecipes.length > pageSize;
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
