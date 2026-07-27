/**
 * Remove a recipe from user's favorites
 */

import * as recipeFavoriteDao from '../../../db/daos/recipeFavoriteDao.ts';
import errors from '../../../httpErrors.ts';
import type { AppContext } from '../../../types.ts';
import type { DeleteFavoriteParams } from './schema.ts';

export default async (
  ctx: AppContext<{ Params: DeleteFavoriteParams; RespBody: void }>,
): Promise<void> => {
  const { slug } = ctx.sanitizedRequest.params!;

  const { userId } = ctx.state;

  const removed = await recipeFavoriteDao.removeFavorite(userId, slug);

  if (!removed) {
    throw new errors.BadRequestError(`failed to remove favorite for ${slug}`, 'FAVORITE_NOT_FOUND');
  }

  ctx.status = 204;
};
