/**
 * Data Access Object for users table
 */

import type { Sql } from 'postgres';
import type { UserEntity } from '../schemas/user.ts';
import { optionalTransaction } from './utils.ts';

/**
 * Create a new user
 * @param sql - SQL client
 * @param user - User object
 */
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

/**
 * Find user by username
 * @param sql - SQL client
 * @param username - Username
 */
export const findByUsername = optionalTransaction(
  async (sql: Sql, username: string): Promise<UserEntity | null> => {
    const [user] = await sql`
    SELECT * FROM users 
    WHERE username = ${username} 
    LIMIT 1
  `;

    if (!user) {
      return null;
    }

    return user as UserEntity;
  }
);

/**
 * Check if user exists by username
 * @param sql - SQL client
 * @param username - Username
 */
export const userExists = optionalTransaction(
  async (sql: Sql, username: string): Promise<boolean> => {
    const [exists] = await sql`
    SELECT EXISTS (
      SELECT 1 FROM users 
      WHERE username = ${username}
    ) AS exists
  `;

    return Boolean(exists?.exists);
  }
);
