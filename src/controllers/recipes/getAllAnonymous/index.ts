/**
 * Get all recipes with pagination and search (anonymous access)
 */

import * as recipeDao from '../../../db/daos/recipeDao.ts';
import type { AppContext } from '../../../types.ts';
import type { RecipeSearchQuery } from './schema.ts';

export default async (ctx: AppContext): Promise<void> => {
  const { q, cursor, page, pageSize } = ctx.sanitizedRequest.query as RecipeSearchQuery;

  if (page !== undefined) {
    const rawRecipes = await recipeDao.pageSearchAnonymous(q, page, pageSize);

    const recipeCount = await recipeDao.getRecipeCountAnonymous(q);
    const totalCount = recipeCount;
    const totalPages = Math.ceil(totalCount / pageSize);

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

  const rawRecipes = await recipeDao.cursorSearchAnonymous(q, pageSize + 1, cursor);

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
