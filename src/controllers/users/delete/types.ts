/**
 * DELETE /users/{id} — Delete a user and all their data
 * Auth: Cookie
 */

import type { DeleteUserParams } from './schema.ts';

export type Input = DeleteUserParams;

/** 204 No Content */
export type Output = void;
