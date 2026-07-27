/**
 * DELETE /recipes/{slug}/favorite — Remove a recipe from favorites
 * Auth: Cookie
 */

import type { DeleteFavoriteParams } from '../../../controllers/recipes/deleteFavorite/schema.ts';

export type Input = DeleteFavoriteParams;

/** 204 No Content */
export type Output = void;
