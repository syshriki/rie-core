/**
 * GET /users/me — Get current user profile
 * Auth: Cookie
 */

import type { UserEntity } from '../../../schemas/user.ts';

export type Input = void;

export interface Output extends UserEntity {
  recipeCount: number;
  favoriteCount: number;
}
