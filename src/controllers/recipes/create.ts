/**
 * Create a new recipe
 */

import * as recipeDao from '../../db/daos/recipeDao.ts';
import type { RecipeCreateInput } from '../../schemas/recipe.ts';
import type { AppContext } from '../../types.ts';

export default async (ctx: AppContext): Promise<void> => {
  const recipeData = ctx.state.validatedBody as RecipeCreateInput;

  const username = ctx.state.jwt.sub;

  const now = Math.floor(Date.now() / 1000);

  const recipe = await recipeDao.create({
    username,
    title: recipeData.title,
    description: recipeData.description,
    ingredients: recipeData.ingredients,
    instructions: recipeData.instructions,
    createdAt: now,
    updatedAt: now,
  });

  ctx.status = 201;
  ctx.body = recipe;
};
