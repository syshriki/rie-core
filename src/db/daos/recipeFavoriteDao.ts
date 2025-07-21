/**
 * Data Access Object for recipe_favorites table
 */

import type { Sql } from 'postgres';
import type { RecipeEntity } from '../../schemas/recipe.ts';
import type { RecipeFavoriteEntity } from '../../schemas/recipeFavorite.ts';
import { sql as defaultSql } from '../connection.ts';

/**
 * Add a recipe to user's favorites
 * @param username - Username
 * @param recipeId - Recipe ID
 * @param sql - SQL client (optional)
 */
export const addFavorite = async (
  username: string,
  recipeId: number,
  sql: Sql = defaultSql,
): Promise<RecipeFavoriteEntity> => {
  const timestamp = Math.floor(Date.now() / 1000);

  // Try to insert, and if it fails due to conflict, fetch the existing record
  const [favorite] = await sql`
    INSERT INTO recipe_favorites (username, recipe_id, created_at)
    VALUES (${username}, ${recipeId}, ${timestamp})
    ON CONFLICT (username, recipe_id) DO NOTHING
    RETURNING *
  `;

  return favorite as unknown as RecipeFavoriteEntity;
};

/**
 * Remove a recipe from user's favorites
 * @param username - Username
 * @param recipeId - Recipe ID
 * @param sql - SQL client (optional)
 */
export const removeFavorite = async (
  username: string,
  recipeId: number,
  sql: Sql = defaultSql,
): Promise<boolean> => {
  const result = await sql`
    DELETE FROM recipe_favorites
    WHERE username = ${username} AND recipe_id = ${recipeId}
  `;

  return result.count > 0;
};

/**
 * Check if a recipe is in user's favorites
 * @param username - Username
 * @param recipeId - Recipe ID
 * @param sql - SQL client (optional)
 */
export const isFavorite = async (
  username: string,
  recipeId: number,
  sql: Sql = defaultSql,
): Promise<boolean> => {
  const [favorite] = await sql`
    SELECT 1 FROM recipe_favorites
    WHERE username = ${username} AND recipe_id = ${recipeId}
  `;

  return favorite !== undefined;
};

export const getFavorites = async (
  username: string,
  cursor: string | null = null,
  limit = 10,
  sql: Sql = defaultSql,
): Promise<RecipeEntity[]> => {
  const cursorExpression = cursor ? sql`AND r.created_at < ${cursor}` : sql``;

  return sql<RecipeEntity[]>`
    SELECT r.*, true as is_favorite
    FROM recipes r
    JOIN recipe_favorites rf ON r.id = rf.recipe_id
    WHERE rf.username = ${username}
    AND r.created_at < ${cursorExpression}
    ORDER BY r.created_at DESC
    LIMIT ${limit as number}
  `;
};

/**
 * Get user ID by username
 * @param username - Username
 * @param sql - SQL client (optional)
 */
export const getUserIdByUsername = async (
  username: string,
  sql: Sql = defaultSql,
): Promise<number> => {
  const [user] = await sql`
    SELECT id FROM users
    WHERE username = ${username}
  `;

  if (!user) {
    return 0; // Return 0 if user not found, which won't match any favorites
  }

  return user.id as number;
};

/**
 * Delete favorites by recipe ID
 * @param recipeId - Recipe ID
 * @param sql - SQL client (optional)
 */
export const deleteByRecipeId = async (
  recipeId: number,
  sql: Sql = defaultSql,
): Promise<number> => {
  const result = await sql`
    DELETE FROM recipe_favorites
    WHERE recipe_id = ${recipeId}
  `;

  return result.count;
};
