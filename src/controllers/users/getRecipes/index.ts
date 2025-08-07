/**
 * Get all recipes authored by a specific user
 */

import * as recipeDao from '../../../db/daos/recipeDao.ts';
import type { AppContext } from '../../../types.ts';
import type { GetUserRecipesParam, GetUserRecipesQuery } from './schema.ts';

export default async (ctx: AppContext): Promise<void> => {
  const { id } = ctx.sanitizedRequest.params as GetUserRecipesParam;
  const { cursor, pageSize = 10 } = ctx.sanitizedRequest.query as GetUserRecipesQuery;

  const { userId } = ctx.state;

  const cursorDate = cursor ? new Date(cursor) : null;

  const rawRecipes = await recipeDao.findByAuthorId(id, userId, cursorDate, pageSize + 1);

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
