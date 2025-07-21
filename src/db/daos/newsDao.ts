import type { Sql } from 'postgres';
import type { NewsEntity } from '../../schemas/news.ts';
import { sql as defaultSql } from '../connection.ts';

export const create = async (
  news: Omit<NewsEntity, 'id'>,
  sql: Sql = defaultSql,
): Promise<NewsEntity> => {
  const [createdNews] = await sql`
    INSERT INTO news (title, content, recipe_id)
    VALUES (${news.title}, ${news.content}, ${news.recipeId || null})
    RETURNING *
  `;
  return createdNews as NewsEntity;
};

export const findById = async (id: number, sql: Sql = defaultSql): Promise<NewsEntity | null> => {
  const [news] = await sql`
    SELECT * FROM news WHERE id = ${id}
  `;
  return news as NewsEntity | null;
};

export const findAll = async (
  cursor: string | null = null,
  limit = 10,
  sql: Sql = defaultSql,
): Promise<NewsEntity[]> => {
  if (cursor) {
    const news = await sql`
      SELECT * FROM news 
      WHERE created_at < ${cursor as string}
      ORDER BY created_at DESC 
      LIMIT ${limit as number}
    `;
    return news as unknown as NewsEntity[];
  }

  // Explicit type casting to address type compatibility issues with postgres-sql
  const news = await sql`
    SELECT * FROM news 
    ORDER BY created_at DESC 
    LIMIT ${limit as number}
  `;
  return news as unknown as NewsEntity[];
};

/**
 * Find news items by recipe ID
 * @param recipeId - Recipe ID
 * @param cursor - Pagination cursor (news created_at timestamp)
 * @param limit - Maximum number of news items to return
 * @param sql - SQL client (optional)
 */
export const findByRecipeId = async (
  recipeId: number,
  cursor: string | null = null,
  limit = 10,
  sql: Sql = defaultSql,
): Promise<NewsEntity[]> => {
  if (cursor) {
    // Explicit type casting for SQL parameters
    const news = await sql`
    SELECT * FROM news 
    WHERE recipe_id = ${recipeId as number} 
    AND created_at < ${cursor as string}
    ORDER BY created_at DESC 
    LIMIT ${limit as number}
  `;
    return news as unknown as NewsEntity[];
  }
  // Explicit type casting for SQL parameters
  const news = await sql`
    SELECT * FROM news 
    WHERE recipe_id = ${recipeId as number}
    ORDER BY created_at DESC 
    LIMIT ${limit as number}
  `;
  return news as unknown as NewsEntity[];
};

/**
 * Delete news by recipe ID
 * @param recipeId - Recipe ID
 * @param sql - SQL client (optional)
 */
export const deleteByRecipeId = async (
  recipeId: number,
  sql: Sql = defaultSql,
): Promise<number> => {
  const result = await sql`
  DELETE FROM news 
  WHERE recipe_id = ${recipeId}
  `;
  return result.count;
};
