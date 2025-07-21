/**
 * Get user's favorite recipes
 */

import * as recipeFavoriteDao from '../../db/daos/recipeFavoriteDao.ts';
import type { PaginationQuery } from '../../schemas/index.ts';
import type { AppContext } from '../../types.ts';

export default async (ctx: AppContext): Promise<void> => {
  // Get pagination parameters from validated query
  const { cursor, limit = 10 } = ctx.state.validatedQuery as PaginationQuery;

  // Get current user's username
  // For authenticated endpoints, ctx.state.user is guaranteed to be defined by auth middleware
  const { username } = ctx.state.user as { username: string };

  const recipes = await recipeFavoriteDao.getFavorites(username, cursor || null, limit);

  // Calculate pagination for next page
  const count = recipes.length;
  const nextCursor = count < limit ? null : recipes[count - 1].createdAt;

  // Return paginated favorite recipes
  ctx.body = {
    hasMore: nextCursor !== null,
    nextCursor,
    recipes,
  };
};
