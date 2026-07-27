import * as recipeDao from '../../../db/daos/recipeDao.ts';
import * as recipeFavoriteDao from '../../../db/daos/recipeFavoriteDao.ts';
import errors from '../../../httpErrors.ts';
import type { RecipeFavoriteEntity } from '../../../schemas/recipeFavorite.ts';
import type { AppContext } from '../../../types.ts';
import type { CreateFavoriteParam } from './schema.ts';

export default async (
  ctx: AppContext<{ Params: CreateFavoriteParam; RespBody: RecipeFavoriteEntity }>,
): Promise<void> => {
  const { slug } = ctx.sanitizedRequest.params!;

  const { userId } = ctx.state;

  const recipe = await recipeDao.findBySlug(slug, userId);

  if (!recipe) {
    throw new errors.BadRequestError(`recipe not found ${slug}`, 'RECIPE_NOT_FOUND');
  }

  ctx.body = await recipeFavoriteDao.addFavorite(userId, recipe.slug);
};
