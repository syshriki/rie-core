import * as recipeDao from '../../../db/daos/recipeDao.ts';
import errors from '../../../httpErrors.ts';
import type { AppContext } from '../../../types.ts';
import type { GetOneParam } from './schema.ts';

export default async (ctx: AppContext): Promise<void> => {
  const { slug } = ctx.sanitizedRequest.params as GetOneParam;

  const { userId } = ctx.state;

  const recipe = await recipeDao.findBySlug(slug, userId);

  if (!recipe) {
    throw new errors.BadRequestError(`recipe with slug ${slug} not found`, 'RECIPE_NOT_FOUND');
  }

  ctx.body = recipe;
};
