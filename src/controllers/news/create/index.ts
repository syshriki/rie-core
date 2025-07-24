/**
 * Controller for creating news
 */

import * as newsDao from '../../../db/daos/newsDao.ts';
import { foreignKeyErrorHandler } from '../../../db/utils.ts';
import type { AppContext } from '../../../types.ts';
import type { CreateNewsBody } from './schema.ts';

export default async (ctx: AppContext): Promise<void> => {
  const { title, text, type, recipeSlug } = ctx.sanitizedRequest.body as CreateNewsBody;

  const { userId } = ctx.state;

  const news = await newsDao
    .create({
      title,
      text,
      type,
      authorId: userId,
      recipeSlug: recipeSlug || null,
    })
    .catch(
      foreignKeyErrorHandler({
        message: `recipe with slug '${recipeSlug}' does not exist`,
        code: 'RECIPE_NOT_FOUND',
        constraint: 'fk_news_recipe_slug',
      }),
    );

  ctx.status = 201;
  ctx.body = news;
};
