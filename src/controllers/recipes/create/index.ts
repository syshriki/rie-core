import _ from 'lodash';
import type postgres from 'postgres';
import { sql } from '../../../db/connection.ts';
import * as recipeDao from '../../../db/daos/recipeDao.ts';
import * as slugDao from '../../../db/daos/slugDao.ts';
import type { RecipeEntity } from '../../../schemas/recipe.ts';
import type { AppContext } from '../../../types.ts';
import type { CreateRecipeBody } from './schema.ts';

export default async (
  ctx: AppContext<{ ReqBody: CreateRecipeBody; RespBody: RecipeEntity }>,
): Promise<void> => {
  const recipeData = ctx.sanitizedRequest.body!;

  await sql.begin(async (transaction: postgres.Sql) => {
    const { slug } = await slugDao.createRecipeSlug(transaction);

    const required = {
      authorId: ctx.state.userId,
      title: recipeData.title,
      recipe: recipeData.recipe,
      slug,
    };

    const optional = _.omitBy(
      {
        description: recipeData.description,
        ingredients: recipeData.ingredients,
      },
      _.isNil,
    );

    const recipe = await recipeDao.create(
      {
        ...required,
        ...optional,
      },
      transaction,
    );

    ctx.status = 201;
    ctx.body = recipe;
  });
};
