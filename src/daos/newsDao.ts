import type { Sql } from 'postgres';
import type { NewsEntity } from '../schemas/news.ts';
import { optionalTransaction } from './utils.ts';

export const create = optionalTransaction(
  async (sql: Sql, news: Omit<NewsEntity, 'id'>): Promise<NewsEntity> => {
    const [createdNews] = await sql`
      INSERT INTO news (title, content, recipe_id)
      VALUES (${news.title}, ${news.content}, ${news.recipeId || null})
      RETURNING *
    `;
    return createdNews as NewsEntity;
  }
);

export const findById = optionalTransaction(
  async (sql: Sql, id: number): Promise<NewsEntity | null> => {
    const [news] = await sql`
    SELECT * FROM news WHERE id = ${id}
  `;

    if (!news) {
      return null;
    }

    return news as NewsEntity;
  }
);

export const findAll = optionalTransaction(
  async (sql: Sql, cursor: string | null = null, limit = 10): Promise<NewsEntity[]> => {
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
  }
);

/**
 * Find news items by recipe ID
 * @param sql - SQL client
 * @param recipeId - Recipe ID
 * @param cursor - Pagination cursor (news created_at timestamp)
 * @param limit - Maximum number of news items to return
 */
export const findByRecipeId = optionalTransaction(
  async (
    sql: Sql,
    recipeId: number,
    cursor: string | null = null,
    limit = 10
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
  }
);

/**
 * Delete news by recipe ID
 * @param sql - SQL client
 * @param recipeId - Recipe ID
 */
export const deleteByRecipeId = optionalTransaction(
  async (sql: Sql, recipeId: number): Promise<number> => {
    const result = await sql`
    DELETE FROM news 
    WHERE recipe_id = ${recipeId}
  `;
    return result.count;
  }
);
