/**
 * Get all recipes with pagination and search
 */

import * as recipeDao from '../../daos/recipeDao.ts';
import * as recipeFavoriteDao from '../../daos/recipeFavoriteDao.ts';
import * as userDao from '../../daos/userDao.ts';
import type { RecipeEntity, RecipeSearchQuery } from '../../schemas/recipe.ts';
import type { AppContext, AppError } from '../../types.ts';

/**
 * Find user by username or throw if not found
 * @param username - Username
 */
async function findOrThrow(username: string) {
  const user = await userDao.findByUsername(null, username);

  if (!user) {
    const error = new Error(`User with username ${username} not found`) as AppError;
    error.status = 404;
    throw error;
  }

  return user;
}

/**
 * Search recipes by title or description
 * @param searchTerm - Search term
 * @param username - Current user's username
 * @param cursor - Pagination cursor
 * @param limit - Maximum number of recipes to return
 */
async function searchRecipes(
  searchTerm: string,
  username: string,
  cursor: number | null = null,
  limit = 10
): Promise<{
  recipes: RecipeEntity[];
  hasMore: boolean;
  nextCursor: number | null;
}> {
  const recipes = await recipeDao.search(null, searchTerm, cursor, limit + 1);

  // Check if there are more results
  const hasMore = recipes.length > limit;
  if (hasMore) {
    recipes.pop(); // Remove the extra item we fetched
  }

  // Calculate next cursor - only if we have recipes and there are more results
  const nextCursor = hasMore && recipes.length > 0 ? recipes[recipes.length - 1].createdAt : null;

  // Get favorite status for each recipe and ensure correct data types
  const recipesWithFavorite = await Promise.all(
    recipes.map(async (recipe) => {
      const isFavorite = await recipeFavoriteDao.isFavorite(null, username, recipe.id);

      // Ensure ingredients and instructions are properly parsed as arrays
      const ingredients =
        typeof recipe.ingredients === 'string'
          ? JSON.parse(recipe.ingredients)
          : recipe.ingredients;

      const instructions =
        typeof recipe.instructions === 'string'
          ? JSON.parse(recipe.instructions)
          : recipe.instructions;

      return {
        ...recipe,
        ingredients,
        instructions,
        isFavorite,
      };
    })
  );

  return {
    recipes: recipesWithFavorite,
    hasMore,
    nextCursor,
  };
}

export default async (ctx: AppContext): Promise<void> => {
  // Get all parameters from validated query
  const { q = '', cursor, limit = 10 } = ctx.state.validatedQuery as RecipeSearchQuery;

  // Get current user's username
  // For authenticated endpoints, ctx.state.user is guaranteed to be defined by auth middleware
  const { username } = ctx.state.user as { username: string };

  // Ensure user exists
  await findOrThrow(username);

  // Get recipes with search and pagination
  const recipeResults = await searchRecipes(q, username, cursor || null, limit);

  // Return the result directly (pagination has been handled)
  ctx.body = recipeResults;
};
