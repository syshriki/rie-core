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
