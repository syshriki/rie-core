import * as recipeDao from '../../db/daos/recipeDao.ts';
import * as recipeFavoriteDao from '../../db/daos/recipeFavoriteDao.ts';
import errors from '../../httpErrors.ts';
import type { RecipeIdParam } from '../../schemas/recipe.ts';
import type { AppContext } from '../../types.ts';

export default async (ctx: AppContext): Promise<void> => {
  const { id } = ctx.state.validatedParams as RecipeIdParam;

  const { username } = ctx.state.user as { username: string };

  const recipe = await recipeDao.findById(id);

  if (!recipe) {
    throw new errors.BadRequestError(`Recipe not found ${id}`, 'RECIPE_NOT_FOUND');
  }

  ctx.body = await recipeFavoriteDao.addFavorite(username, id);
};
