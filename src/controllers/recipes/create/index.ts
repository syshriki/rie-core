import _ from 'lodash';
import * as recipeDao from '../../../db/daos/recipeDao.ts';
import type { AppContext, ExtendedAppContext } from '../../../types.ts';
import type { CreateRecipeBody } from './schema.ts';
/**
 * Converts a title string to a URL-friendly slug
 * @param title The recipe title to convert
 * @returns A URL-friendly slug version of the title
 */
export const titleToSlug = (title: string): string => {
  return title
    .toLowerCase() // Convert to lowercase
    .trim() // Remove leading/trailing whitespace
    .replace(/\s+/g, '-') // Replace spaces with dashes
    .replace(/[^\w\-\/]/g, '') // Remove non-word chars except dashes and slashes
    .replace(/\-+/g, '_') // Replace multiple dashes with a single dash
    .replace(/^\-+|\-+$/g, ''); // Remove leading/trailing dashes
};

export default async (ctx: AppContext): Promise<void> => {
  const recipeData = ctx.sanitizedRequest.body as CreateRecipeBody;
  const slug = titleToSlug(recipeData.title);

  const required = {
    authorId: ctx.state.userId,
    title: recipeData.title,
    recipe: recipeData.recipe,
    slug,
  };

  const optional = _.omitBy(
    {
      description: recipeData.description,
      ingredients: recipeData.ingredients,
    },
    _.isNil,
  );

  const recipe = await recipeDao.create({
    ...required,
    ...optional,
  });

  ctx.status = 201;
  ctx.body = recipe;
};
