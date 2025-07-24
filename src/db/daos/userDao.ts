import type { Sql } from 'postgres';
import type { UserCreateInput, UserEntity } from '../../schemas/user.ts';
import { sql as defaultSql } from '../connection.ts';

export const create = async (user: UserCreateInput, sql: Sql = defaultSql): Promise<UserEntity> => {
  const [createdUser] = await sql`
    INSERT INTO users ${sql(user)} 
    RETURNING *
  `;
  return createdUser as UserEntity;
};

export const findById = async (id: number, sql: Sql = defaultSql): Promise<UserEntity | null> => {
  const [user] = await sql`
    SELECT * FROM users 
    WHERE id = ${id} 
    LIMIT 1
  `;

  return user as UserEntity;
};

interface UserWithRecipeCounts extends UserEntity {
  recipeCount: number;
  favoriteCount: number;
}

export const findFullUserProfile = async (
  id: number,
  sql: Sql = defaultSql,
): Promise<UserWithRecipeCounts | null> => {
  const [profile] = await sql<UserWithRecipeCounts[]>`
    SELECT 
      u.*,
      (SELECT COUNT(1) FROM recipes WHERE author_id = u.id AND deleted = false)::integer AS recipe_count,
      (SELECT COUNT(1) FROM recipe_favorites WHERE user_id = u.id)::integer AS favorite_count
    FROM users u
    WHERE u.id = ${id}
    LIMIT 1
  `;

  return profile;
};
