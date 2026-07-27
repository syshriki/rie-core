import type { Sql } from 'postgres';
import type { NewsCreateInput, NewsEntity } from '../../schemas/news.ts';
import { sql as defaultSql } from '../connection.ts';

export const create = async (news: NewsCreateInput, sql: Sql = defaultSql): Promise<NewsEntity> => {
  const [createdNews] = await sql`
    INSERT INTO news ${sql(news)}
    RETURNING *
  `;
  return createdNews as NewsEntity;
};

export const deleteByAuthorId = async (
  authorId: string,
  sql: Sql = defaultSql,
): Promise<number> => {
  const result = await sql`
    DELETE FROM news WHERE author_id = ${authorId}
  `;
  return result.count;
};

export const deleteByRecipeSlugs = async (
  slugs: string[],
  sql: Sql = defaultSql,
): Promise<number> => {
  const result = await sql`
    DELETE FROM news WHERE recipe_slug = ANY(${slugs})
  `;
  return result.count;
};

export const findAll = async (
  cursor: string | null = null,
  limit = 10,
  sql: Sql = defaultSql,
): Promise<NewsEntity[]> => {
  const news = await sql<NewsEntity[]>`
    SELECT * FROM news 
    ${cursor ? sql`WHERE created_at < ${cursor}` : sql``}
    ORDER BY created_at DESC 
    LIMIT ${limit as number}
  `;
  return news;
};
