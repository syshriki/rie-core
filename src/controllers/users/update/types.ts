/**
 * PATCH /users/me — Update the current user's profile
 * Auth: Cookie
 */

import type { UpdateUserBody } from './schema.ts';
import type { UserEntity } from '../../../schemas/user.ts';

export type Input = UpdateUserBody;
export type Output = UserEntity;
