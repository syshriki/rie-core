/**
 * Delete a recipe
 */

import type postgres from 'postgres';
import { sql } from '../../db/connection.ts';
import * as recipeDao from '../../db/daos/recipeDao.ts';
import * as recipeFavoriteDao from '../../db/daos/recipeFavoriteDao.ts';
import type { RecipeIdParam } from '../../schemas/recipe.ts';
import type { AppContext, AppError } from '../../types.ts';

/**
 * Delete a recipe
 * @param id - Recipe ID
 * @param username - Current user's username
 */
async function deleteRecipe(id: number, username: string): Promise<void> {
  // First verify the recipe exists and belongs to the user
  const recipe = await recipeDao.findById(id);

  if (!recipe) {
    const error = new Error(`Recipe with ID ${id} not found`) as AppError;
    error.status = 404;
    throw error;
  }

  if (recipe.username !== username) {
    const error = new Error('Not authorized to delete this recipe') as AppError;
    error.status = 403;
    throw error;
  }

  // Use a transaction to delete recipe and all associated data
  await sql.begin(async (transaction: postgres.Sql) => {
    // Delete any favorites for this recipe
    await recipeFavoriteDao.deleteByRecipeId(id, transaction);

    // Finally delete the recipe itself
    const deleted = await recipeDao.deleteRecipe(id, transaction);

    if (!deleted) {
      throw new Error(`Failed to delete recipe with ID ${id}`);
    }
  });
}

export default async (ctx: AppContext): Promise<void> => {
  // Get recipe ID from validated params
  const { id } = ctx.state.validatedParams as RecipeIdParam;

  // Get current user's username
  // For authenticated endpoints, ctx.state.user is guaranteed to be defined by auth middleware
  const { username } = ctx.state.user as { username: string };

  // Delete the recipe
  await deleteRecipe(id, username);

  // Return 204 No Content status
  ctx.status = 204;
};
