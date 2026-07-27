/**
 * Get all recipes authored by a specific user (anonymous access)
 */

import * as recipeDao from '../../../db/daos/recipeDao.ts';
import type { Output as RecipesResponse } from '../../../types/public/users/getRecipesAnonymous.ts';
import type { AppContext } from '../../../types.ts';
import type { GetUserRecipesParam, GetUserRecipesQuery } from './schema.ts';

export default async (
  ctx: AppContext<{ Params: GetUserRecipesParam; Query: GetUserRecipesQuery; RespBody: RecipesResponse }>,
): Promise<void> => {
  const { authorId } = ctx.sanitizedRequest.params!;
  const { cursor, pageSize = 10 } = ctx.sanitizedRequest.query!;

  const cursorDate = cursor ? new Date(cursor) : null;

  const rawRecipes = await recipeDao.findByAuthorIdAnonymous(authorId, cursorDate, pageSize + 1);

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
