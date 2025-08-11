import * as newsDao from '../../../db/daos/newsDao.ts';
import type { PaginationQuery } from '../../../schemas/pagination.ts';
import type { AppContext } from '../../../types.ts';

export default async (ctx: AppContext): Promise<void> => {
  const { cursor, pageSize = 10 } = ctx.sanitizedRequest.query as PaginationQuery;

  const news = await newsDao.findAll(cursor, pageSize);

  const count = news.length;
  const nextCursor = count < pageSize ? null : news[count - 1].createdAt;

  ctx.body = {
    hasMore: nextCursor !== null,
    nextCursor,
    news,
  };
};
