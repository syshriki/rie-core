/**
 * Get all news with pagination
 */

import * as newsDao from '../../db/daos/newsDao.ts';
import type { PaginationQuery } from '../../schemas/index.ts';
import type { AppContext } from '../../types.ts';

export default async (ctx: AppContext): Promise<void> => {
  // Get pagination parameters from validated query
  const { cursor, limit = 10 } = ctx.state.validatedQuery as PaginationQuery;

  // Get all news
  const news = await newsDao.findAll(cursor, limit);

  // Calculate pagination for next page
  const count = news.length;
  const nextCursor = count < limit ? null : news[count - 1].createdAt;

  // Return paginated news list
  ctx.body = {
    hasMore: nextCursor !== null,
    nextCursor,
    news,
  };
};
