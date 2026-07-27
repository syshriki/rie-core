/**
 * Delete a user and all their data in a single transaction
 */

import type postgres from 'postgres';
import { sql } from '../../../db/connection.ts';
import * as newsDao from '../../../db/daos/newsDao.ts';
import * as recipeDao from '../../../db/daos/recipeDao.ts';
import * as recipeFavoriteDao from '../../../db/daos/recipeFavoriteDao.ts';
import * as slugDao from '../../../db/daos/slugDao.ts';
import * as userDao from '../../../db/daos/userDao.ts';
import { BadRequestError, ForbiddenError } from '../../../httpErrors.ts';
import type { AppContext } from '../../../types.ts';
import type { DeleteUserParams } from './schema.ts';

export default async (ctx: AppContext<{ Params: DeleteUserParams; RespBody: void }>): Promise<void> => {
  const { id } = ctx.sanitizedRequest.params!;
  const { userId } = ctx.state;

  if (id !== userId) {
    throw new ForbiddenError(
      'not authorized to delete this user',
      'UNAUTHORIZED_DELETE',
    );
  }

  const user = await userDao.findById(id);

  if (!user) {
    throw new BadRequestError(`user with id ${id} not found`, 'USER_NOT_FOUND');
  }

  await sql.begin(async (transaction: postgres.Sql) => {
    const recipeSlugs = await recipeDao.findSlugsByAuthorId(id, transaction);

    if (recipeSlugs.length > 0) {
      await recipeFavoriteDao.deleteByRecipeSlugs(recipeSlugs, transaction);
      await newsDao.deleteByRecipeSlugs(recipeSlugs, transaction);
    }

    await recipeFavoriteDao.deleteByUserId(id, transaction);
    await newsDao.deleteByAuthorId(id, transaction);
    await recipeDao.hardDeleteByAuthorId(id, transaction);

    if (recipeSlugs.length > 0) {
      await slugDao.deleteBySlugs(recipeSlugs, transaction);
    }

    const deleted = await userDao.deleteById(id, transaction);

    if (!deleted) {
      throw new BadRequestError(
        `user with id ${id} could not be deleted`,
        'USER_NOT_DELETED',
      );
    }
  });

  ctx.status = 204;
};
