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
  userId: string,
  sql: postgres.Sql = defaultSql,
): Promise<RecipeEntity | null> => {
  const [recipe] = await sql`
    SELECT * FROM recipes 
      LEFT JOIN recipe_favorites ON 
        recipes.slug = recipe_favorites.recipe_slug AND 
        recipe_favorites.user_id = ${userId}
    WHERE recipes.id = ${id} AND deleted_at is NULL LIMIT 1
  `;

  return recipe as RecipeEntity;
};

export const findBySlug = async (
  slug: string,
  userId: string,
  sql: postgres.Sql = defaultSql,
): Promise<RecipeEntity | null> => {
  const [recipe] = await sql`
    SELECT r.*, CASE WHEN recipe_favorites.id IS NULL THEN FALSE ELSE TRUE END as is_favorite
    FROM recipes r
    LEFT JOIN recipe_favorites ON r.slug = recipe_favorites.recipe_slug AND recipe_favorites.user_id = ${userId}
    WHERE r.slug = ${slug} AND  deleted = FALSE LIMIT 1
  `;

  return recipe as RecipeEntity;
};

export const findBySlugAnonymous = async (
  slug: string,
  sql: postgres.Sql = defaultSql,
): Promise<RecipeEntity | null> => {
  const [recipe] = await sql`
    SELECT r.*
    FROM recipes r
    WHERE r.slug = ${slug} AND deleted_at is NULL LIMIT 1
  `;

  return recipe as RecipeEntity;
};

export const deleteByRecipeSlug = async (
  slug: string,
  sql: postgres.Sql = defaultSql,
): Promise<boolean> => {
  const result = await sql`
    UPDATE recipes SET deleted_at = NOW(), deleted = TRUE WHERE slug = ${slug} AND deleted_at IS NULL
  `;
  return result.count > 0;
};

export const pageSearch = async (
  searchTerm: string,
  userId: string,
  page: number,
  pageSize: number,
  sql: postgres.Sql = defaultSql,
): Promise<RecipeSearchEntity[]> => {
  const offset = (page - 1) * pageSize;
  return sql<RecipeSearchEntity[]>`
      SELECT r.*, CASE WHEN rf.id IS NULL THEN FALSE ELSE TRUE END as is_favorite 
      FROM recipes r 
      LEFT JOIN recipe_favorites rf ON r.slug = rf.recipe_slug AND rf.user_id = ${userId}
      WHERE (title ILIKE ${`%${searchTerm}%`} OR r.description ILIKE ${`%${searchTerm}%`} ) and deleted = FALSE
      ORDER BY r.created_at DESC 
      LIMIT ${pageSize as number} OFFSET ${offset as number}
    `;
};

export const cursorSearch = async (
  searchTerm: string,
  userId: string,
  pageSize: number,
  cursor?: Date,
  sql: postgres.Sql = defaultSql,
): Promise<RecipeSearchEntity[]> => {
  return sql<RecipeSearchEntity[]>`
    SELECT r.*, CASE WHEN rf.id IS NULL THEN FALSE ELSE TRUE END as is_favorite 
    FROM recipes r 
    LEFT JOIN recipe_favorites rf ON r.slug = rf.recipe_slug AND rf.user_id = ${userId}
    WHERE (title ILIKE ${`%${searchTerm}%`} OR r.description ILIKE ${`%${searchTerm}%`} ) and deleted = FALSE
    ${cursor ? sql`AND r.created_at < ${cursor}` : sql``}
    ORDER BY r.created_at DESC 
    LIMIT ${pageSize as number}
  `;
};

export const pageSearchAnonymous = async (
  searchTerm: string,
  page: number,
  pageSize: number,
  sql: postgres.Sql = defaultSql,
): Promise<RecipeEntity[]> => {
  const offset = (page - 1) * pageSize;
  return sql<RecipeEntity[]>`
      SELECT r.* 
      FROM recipes r 
      WHERE (title ILIKE ${`%${searchTerm}%`} OR r.description ILIKE ${`%${searchTerm}%`} )  and deleted = FALSE
      ORDER BY r.created_at DESC 
      LIMIT ${pageSize as number} OFFSET ${offset as number}
    `;
};

export const cursorSearchAnonymous = async (
  searchTerm: string,
  pageSize: number,
  cursor?: Date,
  sql: postgres.Sql = defaultSql,
): Promise<RecipeEntity[]> => {
  return sql<RecipeEntity[]>`
    SELECT r.*
    FROM recipes r 
    WHERE (title ILIKE ${`%${searchTerm}%`} OR r.description ILIKE ${`%${searchTerm}%`} ) and deleted = FALSE
    ${cursor ? sql`AND r.created_at < ${cursor}` : sql``}
    ORDER BY r.created_at DESC 
    LIMIT ${pageSize as number}
  `;
};

export const getRecipeCount = async (
  searchTerm: string,
  _userId: string, // Parameter kept for API consistency but not used in query
  sql: postgres.Sql = defaultSql,
): Promise<number> => {
  const [result] = await sql<[{ count: number }]>`
    SELECT COUNT(*) as count
    FROM recipes r 
    WHERE (title ILIKE ${`%${searchTerm}%`} OR r.description ILIKE ${`%${searchTerm}%`} ) and deleted = FALSE
  `;

  return Number(result.count);
};

export const getRecipeCountAnonymous = async (
  searchTerm: string,
  sql: postgres.Sql = defaultSql,
): Promise<number> => {
  const [result] = await sql<[{ count: number }]>`
    SELECT COUNT(*) as count
    FROM recipes r 
    WHERE (title ILIKE ${`%${searchTerm}%`} OR r.description ILIKE ${`%${searchTerm}%`} ) and deleted = FALSE
  `;

  return Number(result.count);
};

export const findWithFavoriteStatus = async (
  userId: string,
  cursor: number | null = null,
  pageSize = 10,
  sql: postgres.Sql = defaultSql,
): Promise<Array<RawRecipeEntity>> => {
  return sql<RawRecipeEntity[]>`
    SELECT r.*, 
      CASE WHEN rf.recipe_id IS NOT NULL THEN TRUE ELSE FALSE END AS is_favorite
    FROM recipes r
    LEFT JOIN recipe_favorites rf ON r.id = rf.recipe_id AND rf.user_id = ${userId}
    ${cursor ? sql`{WHERE r.created_at < ${cursor}` : sql``}
    ORDER BY r.created_at DESC
    LIMIT ${pageSize as number}
  `;
};

export const findByAuthorId = async (
  authorId: string,
  userId: string,
  cursor: Date | null = null,
  pageSize = 10,
  sql: postgres.Sql = defaultSql,
): Promise<RecipeSearchEntity[]> => {
  const results = await sql<RecipeSearchEntity[]>`
    SELECT r.*, CASE WHEN rf.id IS NULL THEN FALSE ELSE TRUE END as is_favorite 
    FROM recipes r 
    LEFT JOIN recipe_favorites rf ON r.slug = rf.recipe_slug AND rf.user_id = ${userId}
    WHERE r.author_id = ${authorId} AND r.deleted_at IS NULL
    ${cursor ? sql`AND r.created_at < ${cursor}` : sql``}
    ORDER BY r.created_at DESC 
    LIMIT ${pageSize as number}
  `;
  return results;
};

export const findByAuthorIdAnonymous = async (
  authorId: string,
  cursor: Date | null = null,
  pageSize = 10,
  sql: postgres.Sql = defaultSql,
): Promise<RecipeEntity[]> => {
  const results = await sql<RecipeEntity[]>`
    SELECT r.*
    FROM recipes r 
    WHERE r.author_id = ${authorId} AND r.deleted_at IS NULL
    ${cursor ? sql`AND r.created_at < ${cursor}` : sql``}
    ORDER BY r.created_at DESC 
    LIMIT ${pageSize as number}
  `;
  return results;
};
