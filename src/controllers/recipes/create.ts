/**
 * Create a new recipe
 */

import * as recipeDao from '../../daos/recipeDao.ts';
import type { RecipeCreateInput } from '../../schemas/recipe.ts';
import type { AppContext } from '../../types.ts';

export default async (ctx: AppContext): Promise<void> => {
  const recipeData = ctx.state.validatedBody as RecipeCreateInput;

  const { username } = ctx.state.user as { username: string };

  const now = Math.floor(Date.now() / 1000);

  const recipe = await recipeDao.create(null, {
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
