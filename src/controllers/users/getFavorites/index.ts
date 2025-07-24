/**
 * Get user's favorite recipes
 */

import * as recipeFavoriteDao from '../../../db/daos/recipeFavoriteDao.ts';
import type { AppContext } from '../../../types.ts';
import type { GetUserFavoritesParams, GetUserFavoritesQuery } from './schema.ts';

export default async (ctx: AppContext): Promise<void> => {
  const { cursor, limit = 10 } = ctx.sanitizedRequest.query as GetUserFavoritesQuery;
  const { id: targetUserId } = ctx.sanitizedRequest.params as GetUserFavoritesParams;
  const currentUserId = ctx.state.userId;

  const recipes = await recipeFavoriteDao.getFavorites(
    targetUserId,
    currentUserId,
    cursor ? cursor : null,
    limit,
  );

  const count = recipes.length;
  const nextCursor = count < limit ? null : recipes[count - 1].createdAt;

  ctx.body = {
    hasMore: nextCursor !== null,
    nextCursor,
    recipes,
  };
};
