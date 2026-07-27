/**
 * POST /recipes/{slug}/favorite — Add a recipe to favorites
 * Auth: Cookie
 */

import type { CreateFavoriteParam } from '../../../controllers/recipes/addFavorite/schema.ts';
import type { RecipeFavoriteEntity } from '../../../schemas/recipeFavorite.ts';

export type Input = CreateFavoriteParam;
export type Output = RecipeFavoriteEntity;
