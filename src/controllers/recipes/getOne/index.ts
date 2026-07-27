import * as recipeDao from '../../../db/daos/recipeDao.ts';
import errors from '../../../httpErrors.ts';
import type { RecipeWAuthorEntity } from '../../../schemas/recipe.ts';
import type { AppContext } from '../../../types.ts';
import type { GetOneParam } from './schema.ts';

export default async (
  ctx: AppContext<{ Params: GetOneParam; RespBody: RecipeWAuthorEntity }>,
): Promise<void> => {
  const { slug } = ctx.sanitizedRequest.params!;

  const { userId } = ctx.state;

  const recipe = await recipeDao.findBySlug(slug, userId);

  if (!recipe) {
    throw new errors.BadRequestError(`recipe with slug ${slug} not found`, 'RECIPE_NOT_FOUND');
  }

  ctx.body = recipe;
};
