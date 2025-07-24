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

export const getFavorites = async (
  targetUserId: number,
  currentUserId: number,
  cursor: string | null = null,
  limit = 10,
  sql: Sql = defaultSql,
): Promise<RecipeEntity[]> => {
  const cursorExpression = cursor ? sql`AND r.created_at < ${cursor}` : sql``;

  const results = await sql<RecipeEntity[]>`
    SELECT 
      r.*,
      CASE WHEN rf2.id IS NOT NULL THEN true ELSE false END AS is_favorite
    FROM recipes r
    INNER JOIN recipe_favorites rf ON r.slug = rf.recipe_slug
    LEFT JOIN recipe_favorites rf2 ON rf.recipe_slug = rf2.recipe_slug AND rf2.user_id = ${currentUserId}
    WHERE rf.user_id = ${targetUserId}
    ${cursorExpression}
    ORDER BY r.created_at DESC
    LIMIT ${limit as number}
  `;

  return results;
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
