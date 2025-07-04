import type { Sql } from 'postgres';
import type { UserEntity } from '../schemas/user.ts';
import { optionalTransaction } from './utils.ts';

export const create = optionalTransaction(
  async (sql: Sql, user: Omit<UserEntity, 'id'>): Promise<UserEntity> => {
    const [createdUser] = await sql`
      INSERT INTO users (username) 
      VALUES (${user.username}) 
      RETURNING *
    `;
    return createdUser as UserEntity;
  }
);

export const findByUsername = optionalTransaction(
  async (sql: Sql, username: string): Promise<UserEntity | null> => {
    const [user] = await sql`
    SELECT * FROM users 
    WHERE username = ${username} 
    LIMIT 1
  `;

    return user as UserEntity;
  }
);
