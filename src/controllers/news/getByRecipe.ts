/**
 * Get news related to a specific recipe
 */

import * as newsDao from '../../daos/newsDao.ts';
import * as recipeDao from '../../daos/recipeDao.ts';
import errors from '../../errors.ts';
import type { PaginationQuery } from '../../schemas/index.ts';
import type { RecipeIdParam } from '../../schemas/recipe.ts';
import type { AppContext } from '../../types.ts';

export default async (ctx: AppContext): Promise<void> => {
  // Get recipe ID from validated params
  const { id } = ctx.state.validatedParams as RecipeIdParam;

  // Get pagination parameters from validated query
  const { cursor, limit = 10 } = ctx.state.validatedQuery as PaginationQuery;

  const recipe = await recipeDao.findById(null, id);

  if (!recipe) {
    throw new errors.BadRequestError(`Recipe with ID ${id} not found`);
  }

  const news = await newsDao.findByRecipeId(null, id, cursor, limit);

  // Calculate pagination for next page
  const count = news.length;
  const nextCursor = count < limit ? null : news[count - 1].createdAt;

  // Return paginated news list
  ctx.body = {
    hasMore: nextCursor !== null,
    nextCursor,
    news,
  };
};
