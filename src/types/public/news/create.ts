/**
 * POST /news — Create a news item
 * Auth: Cookie
 */

import type { CreateNewsBody } from '../../../controllers/news/create/schema.ts';
import type { NewsEntity } from '../../../schemas/news.ts';

export type Input = CreateNewsBody;
export type Output = NewsEntity;
