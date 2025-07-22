import * as recipeDao from '../../../db/daos/recipeDao.ts';
import * as recipeFavoriteDao from '../../../db/daos/recipeFavoriteDao.ts';
import errors from '../../../httpErrors.ts';
import type { AppContext } from '../../../types.ts';

export default async (ctx: AppContext): Promise<void> => {
  const { slug } = ctx.sanitizedRequest.params as { slug: string };

  const { userId } = ctx.state;

  const recipe = await recipeDao.findBySlug(slug, userId);

  if (!recipe) {
    throw new errors.BadRequestError(`recipe not found ${slug}`, 'RECIPE_NOT_FOUND');
  }

  ctx.body = await recipeFavoriteDao.addFavorite(userId, recipe.slug);
};
