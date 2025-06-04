import * as recipeDao from '../../daos/recipeDao.ts';
import * as recipeFavoriteDao from '../../daos/recipeFavoriteDao.ts';
import errors from '../../errors.ts';
import type { RecipeIdParam } from '../../schemas/recipe.ts';
import type { AppContext } from '../../types.ts';

export default async (ctx: AppContext): Promise<void> => {
  const { id } = ctx.state.validatedParams as RecipeIdParam;

  const { username } = ctx.state.user as { username: string };

  const recipe = await recipeDao.findById(null, id);

  if (!recipe) {
    throw new errors.BadRequestError(`Recipe not found ${id}`);
  }

  ctx.body = await recipeFavoriteDao.addFavorite(null, username, id);
};
