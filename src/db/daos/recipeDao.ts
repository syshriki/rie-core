import type postgres from 'postgres';

import type { CreateRecipeInput, RecipeEntity, RecipeSearchEntity } from '../../schemas/recipe.ts';
import { sql as defaultSql } from '../connection.ts';

type RawRecipeEntity = CreateRecipeInput & {
  ingredients: string | unknown[];
  instructions: string | unknown[];
  isFavorite?: boolean;
  createdAt: string;
};

export const create = async (
  recipe: CreateRecipeInput,
  sql: postgres.Sql = defaultSql,
): Promise<RecipeEntity> => {
  const [createdRecipe] = await sql<RecipeEntity[]>`
    INSERT INTO recipes ${sql(recipe)}
    RETURNING *
  `;

  return createdRecipe;
};

export const findById = async (
  id: number,
  userId: number,
  sql: postgres.Sql = defaultSql,
): Promise<RecipeEntity | null> => {
  const [recipe] = await sql`
    SELECT * FROM recipes INNER JOIN recipe_favorites ON recipes.slug = recipe_favorites.recipe_slug
    WHERE recipes.id = ${id} AND recipe_favorites.user_id = ${userId} LIMIT 1
  `;

  return recipe as RecipeEntity;
};

export const findBySlug = async (
  slug: string,
  userId: number,
  sql: postgres.Sql = defaultSql,
): Promise<RecipeEntity | null> => {
  const [recipe] = await sql`
    SELECT r.*, CASE WHEN recipe_favorites.id IS NULL THEN FALSE ELSE TRUE END as is_favorite
    FROM recipes r
    LEFT JOIN recipe_favorites ON r.slug = recipe_favorites.recipe_slug AND recipe_favorites.user_id = ${userId}
    WHERE r.slug = ${slug} LIMIT 1
  `;

  return recipe as RecipeEntity;
};

export const update = async (
  id: number,
  recipe: Partial<Omit<RecipeEntity, 'id' | 'username' | 'createdAt'>>,
  sql: postgres.Sql = defaultSql,
): Promise<RecipeEntity | null> => {
  const updateData: Record<string, string | number | null> = {};

  if (recipe.title !== undefined) updateData.title = recipe.title;
  if (recipe.description !== undefined) updateData.description = recipe.description;

  if (recipe.ingredients !== undefined) {
    updateData.ingredients = JSON.stringify(recipe.ingredients);
  }

  if (recipe.instructions !== undefined) {
    updateData.instructions = JSON.stringify(recipe.instructions);
  }

  updateData.updated_at = Math.floor(Date.now() / 1000);

  // Only proceed if we have something to update
  if (Object.keys(updateData).length === 0) {
    return await findById(id, sql);
  }

  const columns = Object.keys(updateData).map((key) =>
    sql.unsafe(`${key.replace(/([A-Z])/g, '_$1').toLowerCase()} = ?`, [
      updateData[key] as string | number | null,
    ]),
  );

  const [updatedRecipe] = await sql`
    UPDATE recipes 
    SET ${sql.unsafe(columns.join(', '))}
    WHERE id = ${id}
    RETURNING *
  `;

  return updatedRecipe as RecipeEntity;
};

export const deleteRecipe = async (
  id: number,
  sql: postgres.Sql = defaultSql,
): Promise<boolean> => {
  const result = await sql`
    DELETE FROM recipes WHERE id = ${id}
  `;
  return result.count > 0;
};

export const findByUsername = async (
  username: string,
  cursor: number | null = null,
  limit = 10,
  sql: postgres.Sql = defaultSql,
): Promise<RawRecipeEntity[]> => {
  return sql<RawRecipeEntity[]>`
    SELECT * FROM recipes ${cursor ? sql`WHERE created_at < ${cursor}` : sql``}
    AND username = ${username} 
    ORDER BY created_at DESC 
    LIMIT ${limit as number}
  `;
};

export const search = async (
  searchTerm: string,
  userId: number,
  cursor: Date | null = null,
  limit = 10,
  sql: postgres.Sql = defaultSql,
): Promise<RecipeSearchEntity[]> => {
  return sql<RecipeSearchEntity[]>`
    SELECT r.*, CASE WHEN rf.id IS NULL THEN FALSE ELSE TRUE END as is_favorite 
    FROM recipes r 
    LEFT JOIN recipe_favorites rf ON r.slug = rf.recipe_slug AND rf.user_id = ${userId}
    WHERE (title ILIKE ${`%${searchTerm}%`} OR r.description ILIKE ${`%${searchTerm}%`} )
    ${cursor ? sql`AND r.created_at < ${cursor}` : sql``}
    ORDER BY r.created_at DESC 
    LIMIT ${limit as number}
  `;
};

export const findWithFavoriteStatus = async (
  userId: number,
  cursor: number | null = null,
  limit = 10,
  sql: postgres.Sql = defaultSql,
): Promise<Array<RawRecipeEntity>> => {
  return sql<RawRecipeEntity[]>`
    SELECT r.*, 
      CASE WHEN rf.recipe_id IS NOT NULL THEN TRUE ELSE FALSE END AS is_favorite
    FROM recipes r
    LEFT JOIN recipe_favorites rf ON r.id = rf.recipe_id AND rf.user_id = ${userId}
    ${cursor ? sql`{WHERE r.created_at < ${cursor}` : sql``}
    ORDER BY r.created_at DESC
    LIMIT ${limit as number}
  `;
};

export const findFavorites = async (
  userId: number,
  cursor: number | null = null,
  limit = 10,
  sql: postgres.Sql = defaultSql,
): Promise<Array<RecipeEntity>> => {
  return sql<Array<RecipeEntity>>`
    SELECT r.*, TRUE AS is_favorite
    FROM recipes r
    JOIN recipe_favorites rf ON r.id = rf.recipe_id AND rf.user_id = ${userId}
    WHERE r.created_at < ${cursor}
    ORDER BY r.created_at DESC
    LIMIT ${limit as number}
  `;
};
