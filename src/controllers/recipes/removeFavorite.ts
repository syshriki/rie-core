/**
 * Remove a recipe from user's favorites
 */

import * as recipeFavoriteDao from '../../db/daos/recipeFavoriteDao.ts';
import errors from '../../httpErrors.ts';
import type { RecipeIdParam } from '../../schemas/recipe.ts';
import type { AppContext } from '../../types.ts';

export default async (ctx: AppContext): Promise<void> => {
  // Get recipe ID from validated params
  const { id } = ctx.state.validatedParams as RecipeIdParam;

  // Get current user's username
  // For authenticated endpoints, ctx.state.user is guaranteed to be defined by auth middleware
  const { username } = ctx.state.user as { username: string };

  // Remove from favorites
  const removed = await recipeFavoriteDao.removeFavorite(username, id);

  if (!removed) {
    throw new errors.BadRequestError(`failed to remove favorite ${id}`);
  }

  ctx.status = 200;
};
