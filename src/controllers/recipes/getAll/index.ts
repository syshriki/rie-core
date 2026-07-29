/**
 * Get all recipes with pagination and search
 */

import * as recipeDao from '../../../db/daos/recipeDao.ts';
import type { CursorResponse, Output as RecipesOutput, PageResponse } from './types.ts';
import type { AppContext } from '../../../types.ts';
import type { RecipeSearchQuery } from './schema.ts';

export default async (
  ctx: AppContext<{ Query: RecipeSearchQuery; RespBody: RecipesOutput }>,
): Promise<void> => {
  const { q, cursor, page, pageSize } = ctx.sanitizedRequest.query!;

  const { userId } = ctx.state;

  if (page !== undefined) {
    const rawRecipes = await recipeDao.pageSearch(q, userId, page, pageSize);

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
