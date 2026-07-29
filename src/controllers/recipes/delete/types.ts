/**
 * DELETE /recipes/{slug} — Soft-delete a recipe
 * Auth: Cookie
 */

import type { DeleteRecipeParams } from './schema.ts';

export type Input = DeleteRecipeParams;

/** 204 No Content */
export type Output = void;
