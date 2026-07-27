/**
 * POST /users — Create a new user from the authenticated JWT
 * Auth: Bearer token
 * Note: No request body — user ID comes from the JWT sub claim, username is auto-generated.
 */

import type { UserEntity } from '../../../schemas/user.ts';

export type Input = void;
export type Output = UserEntity;
