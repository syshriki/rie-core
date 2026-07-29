/**
 * GET /news — List news items
 * Auth: Cookie
 */

import type { PaginationQuery } from '../../../schemas/pagination.ts';
import type { NewsEntity } from '../../../schemas/news.ts';

export type Input = PaginationQuery;

export interface Output {
  news: NewsEntity[];
  hasMore: boolean;
  nextCursor: string | Date | null;
}
