import * as newsDao from '../../../db/daos/newsDao.ts';
import type { Output as NewsListResponse } from '../../../types/public/news/getAll.ts';
import type { PaginationQuery } from '../../../schemas/pagination.ts';
import type { AppContext } from '../../../types.ts';

export default async (
  ctx: AppContext<{ Query: PaginationQuery; RespBody: NewsListResponse }>,
): Promise<void> => {
  const { cursor, pageSize = 10 } = ctx.sanitizedRequest.query!;

  const news = await newsDao.findAll(cursor, pageSize);

  const count = news.length;
  const nextCursor = count < pageSize ? null : news[count - 1].createdAt;

  ctx.body = {
    hasMore: nextCursor !== null,
    nextCursor,
    news,
  };
};
