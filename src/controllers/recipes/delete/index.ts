/**
 * Delete a recipe
 */

import type postgres from 'postgres';
import { sql } from '../../../db/connection.ts';
import * as recipeDao from '../../../db/daos/recipeDao.ts';
import * as recipeFavoriteDao from '../../../db/daos/recipeFavoriteDao.ts';
import * as slugDao from '../../../db/daos/slugDao.ts';
import { BadRequestError, ForbiddenError } from '../../../httpErrors.ts';
import type { AppContext } from '../../../types.ts';
import type { DeleteRecipeParams } from './schema.ts';

export default async (ctx: AppContext): Promise<void> => {
  const { slug } = ctx.sanitizedRequest.params as DeleteRecipeParams;
  const { userId } = ctx.state;

  const recipe = await recipeDao.findBySlug(slug, userId);

  if (!recipe) {
    throw new BadRequestError(`recipe with slug ${slug} not found`, 'RECIPE_NOT_FOUND');
  }

  if (recipe.authorId !== userId) {
    throw new ForbiddenError(
      `not authorized to delete recipe with slug ${slug}`,
      'UNAUTHORIZED_DELETE',
    );
  }

  await sql.begin(async (transaction: postgres.Sql) => {
    await recipeFavoriteDao.deleteByRecipeSlug(recipe.slug, transaction);

    const deleted = await recipeDao.deleteByRecipeSlug(slug, transaction);

    await slugDao.deleteSlug(recipe.slug, transaction);

    if (!deleted) {
      throw new BadRequestError(
        `recipe with slug ${slug} could not be deleted`,
        'RECIPE_NOT_DELETED',
      );
    }
  });

  ctx.status = 204;
};
