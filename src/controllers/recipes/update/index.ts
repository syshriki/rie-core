import _ from 'lodash';
import { sql } from '../../../db/connection.ts';
import * as recipeDao from '../../../db/daos/recipeDao.ts';
import { BadRequestError, ForbiddenError } from '../../../httpErrors.ts';
import type { RecipeEntity } from '../../../schemas/recipe.ts';
import type { AppContext } from '../../../types.ts';
import type { UpdateRecipeBody, UpdateRecipeParam } from './schema.ts';

export default async (
  ctx: AppContext<{ Params: UpdateRecipeParam; ReqBody: UpdateRecipeBody; RespBody: RecipeEntity }>,
): Promise<void> => {
  const { slug } = ctx.sanitizedRequest.params!;
  const recipePayload = ctx.sanitizedRequest.body!;
  const { userId } = ctx.state;

  const recipe = await recipeDao.findBySlug(slug, userId);

  if (!recipe) {
    throw new BadRequestError(`recipe with slug ${slug} not found`, 'RECIPE_NOT_FOUND');
  }

  if (recipe.authorId !== userId) {
    throw new ForbiddenError('not authorized to update this recipe', 'UNAUTHORIZED_UPDATE');
  }

  const required = {
    authorId: userId,
    title: recipePayload.title,
    recipe: recipePayload.recipe,
    slug,
  };

  const optional = _.omitBy(
    {
      description: recipePayload.description,
      ingredients: recipePayload.ingredients,
    },
    _.isNil,
  );

  await sql.begin(async (transaction) => {
    await recipeDao.deleteByRecipeSlug(slug, transaction);

    const updatedRecipe = await recipeDao.create(
      {
        ...required,
        ...optional,
      },
      transaction,
    );

    if (!updatedRecipe) {
      throw new BadRequestError(
        `recipe with slug ${slug} could not be updated`,
        'RECIPE_NOT_UPDATED',
      );
    }

    ctx.body = updatedRecipe;
  });
};
