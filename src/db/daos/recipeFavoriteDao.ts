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
  userId: number,
  recipeSlug: string,
  sql: Sql = defaultSql,
): Promise<RecipeFavoriteEntity> => {
  const timestamp = Math.floor(Date.now() / 1000);

  // Try to insert, and if it fails due to conflict, fetch the existing record
  const [favorite] = await sql`
    INSERT INTO recipe_favorites ${sql({
      user_id: userId,
      recipe_slug: recipeSlug,
      created_at: timestamp,
    })}
    ON CONFLICT (user_id, recipe_slug) DO NOTHING
    RETURNING *
  `;

  return favorite as unknown as RecipeFavoriteEntity;
};

export const removeFavorite = async (
  userId: number,
  recipeSlug: string,
  sql: Sql = defaultSql,
): Promise<boolean> => {
  const result = await sql`
    DELETE FROM recipe_favorites
    WHERE user_id = ${userId} AND recipe_slug = ${recipeSlug}
  `;

  return result.count > 0;
};

/**
 * Check if a recipe is in user's favorites
 * @param userId - Number
 * @param recipeId - Recipe ID
 * @param sql - SQL client (optional)
 */
export const isFavorite = async (
  userId: number,
  recipeId: number,
  sql: Sql = defaultSql,
): Promise<boolean> => {
  const [favorite] = await sql`
    SELECT 1 FROM recipe_favorites
    WHERE user_id = ${userId} AND recipe_id = ${recipeId}
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

export const deleteByRecipeSlug = async (
  recipeSlug: string,
  sql: Sql = defaultSql,
): Promise<number> => {
  const result = await sql`
    DELETE FROM recipe_favorites
    WHERE recipe_slug = ${recipeSlug}
  `;

  return result.count;
};
