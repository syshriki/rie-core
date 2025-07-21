/**
 * Update an existing recipe
 */

import * as recipeDao from '../../db/daos/recipeDao.ts';
import type { RecipeEntity, RecipeIdParam, RecipeUpdateInput } from '../../schemas/recipe.ts';
import type { AppContext, AppError } from '../../types.ts';

/**
 * Update a recipe
 * @param id - Recipe ID
 * @param username - Current user's username
 * @param recipeData - Recipe update data
 */
async function updateRecipe(
  id: number,
  username: string,
  recipeData: RecipeUpdateInput,
): Promise<RecipeEntity> {
  // First verify the recipe exists and belongs to the user
  const recipe = await recipeDao.findById(id);

  if (!recipe) {
    const error = new Error(`Recipe with ID ${id} not found`) as AppError;
    error.status = 404;
    throw error;
  }

  if (recipe.username !== username) {
    const error = new Error('Not authorized to update this recipe') as AppError;
    error.status = 403;
    throw error;
  }

  const updatedRecipe = await recipeDao.update(id, recipeData);

  if (!updatedRecipe) {
    const error = new Error(`Failed to update recipe with ID ${id}`) as AppError;
    error.status = 500;
    throw error;
  }

  return updatedRecipe;
}

export default async (ctx: AppContext): Promise<void> => {
  // Get recipe ID from validated params
  const { id } = ctx.state.validatedParams as RecipeIdParam;

  // Get validated request body
  const recipeData = ctx.state.validatedBody as RecipeUpdateInput;

  // Get current user's username
  // For authenticated endpoints, ctx.state.user is guaranteed to be defined by auth middleware
  const { username } = ctx.state.user as { username: string };

  // Update the recipe
  const updatedRecipe = await updateRecipe(id, username, recipeData);

  // Return updated recipe
  ctx.body = updatedRecipe;
};
