import type postgres from 'postgres';

import { sql as defaultSql } from '../connection.ts';

interface SlugEntity {
  slug: string;
  createdAt: Date;
  deletedAt?: Date | null;
  deleted?: boolean;
}

export const createRecipeSlug = async (sql: postgres.Sql = defaultSql): Promise<SlugEntity> => {
  const [{ v }] = await sql<[{ v: number }]>`
            SELECT nextval('recipe_slug') as v;
        `;
  const payload = { slug: `r${v}` };
  const [createdSlug] = await sql<SlugEntity[]>`
            INSERT INTO slugs ${sql(payload)}
            RETURNING *
        `;
  return createdSlug;
};

export const findOne = async (
  slug: string,
  sql: postgres.Sql = defaultSql,
): Promise<SlugEntity | null> => {
  const [foundSlug] = await sql`
    SELECT * FROM slugs 
    WHERE slug = ${slug}
    LIMIT 1
  `;

  return foundSlug as SlugEntity;
};

export const deleteBySlugs = async (
  slugs: string[],
  sql: postgres.Sql = defaultSql,
): Promise<number> => {
  const result = await sql`
    DELETE FROM slugs WHERE slug = ANY(${slugs})
  `;
  return result.count;
};

export const deleteSlug = async (
  slug: string,
  sql: postgres.Sql = defaultSql,
): Promise<boolean> => {
  const result = await sql`
    UPDATE slugs 
    SET deleted_at = NOW(), deleted = TRUE 
    WHERE slug = ${slug} AND deleted_at IS NULL
  `;

  return result.count > 0;
};
