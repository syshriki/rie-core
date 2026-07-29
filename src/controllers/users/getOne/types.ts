/**
 * GET /users/{id} — Get a user by ID
 * Auth: Cookie
 */

import type { GetOneUserParams } from './schema.ts';
import type { UserEntity } from '../../../schemas/user.ts';

export type Input = GetOneUserParams;

export interface Output extends UserEntity {
  recipeCount: number;
  favoriteCount: number;
  isCurrentUser: boolean;
}
