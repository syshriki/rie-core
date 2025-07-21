/**
 * Get a single recipe by ID
 */

import * as recipeDao from '../../db/daos/recipeDao.ts';
import * as recipeFavoriteDao from '../../db/daos/recipeFavoriteDao.ts';
import errors from '../../httpErrors.ts';
import type { RecipeEntity, RecipeIdParam } from '../../schemas/recipe.ts';
import type { AppContext } from '../../types.ts';

export async function getRecipeById(
  id: number,
  username: string,
): Promise<RecipeEntity & { isFavorite: boolean }> {
  const recipe = await recipeDao.findById(id);

  if (!recipe) {
    throw new errors.BadRequestError(`Recipe with ID ${id} not found`);
  }

  const isFavorite = await recipeFavoriteDao.isFavorite(username, id);

  return {
    ...recipe,
    isFavorite,
  };
}

export default async (ctx: AppContext): Promise<void> => {
  // Get recipe ID from validated params
  const { id } = ctx.state.validatedParams as RecipeIdParam;

  // Get current user's username
  // For authenticated endpoints, ctx.state.user is guaranteed to be defined by auth middleware
  const { username } = ctx.state.user as { username: string };

  // Get recipe with favorite status
  const recipe = await getRecipeById(id, username);

  // Return recipe details
  ctx.body = recipe;
};
