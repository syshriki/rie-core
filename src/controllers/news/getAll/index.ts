/**
 * Get all news with pagination
 */

import * as newsDao from '../../../db/daos/newsDao.ts';
import type { PaginationQuery } from '../../../schemas/index.ts';
import type { AppContext } from '../../../types.ts';

export default async (ctx: AppContext): Promise<void> => {
  const { cursor, limit = 10 } = ctx.sanitizedRequest.query as PaginationQuery;

  const news = await newsDao.findAll(cursor, limit);

  const count = news.length;
  const nextCursor = count < limit ? null : news[count - 1].createdAt;

  ctx.body = {
    hasMore: nextCursor !== null,
    nextCursor,
    news,
  };
};
