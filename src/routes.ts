import Router from 'koa-router';
import { paginationSchema } from './schemas/index.ts';

import userCreateController from './controllers/users/create/index.ts';
import userGetOneController from './controllers/users/getOne.ts';

import recipeAddFavoriteController from './controllers/recipes/addFavorite/index.ts';
import recipeCreateController from './controllers/recipes/create/index.ts';
import recipeDeleteController from './controllers/recipes/delete.ts';
import recipeGetAllController from './controllers/recipes/getAll/index.ts';
import recipeGetOneController from './controllers/recipes/getOne/index.ts';
import recipeFavoritesController from './controllers/recipes/getUserFavorites.ts';
import recipeRemoveFavoriteController from './controllers/recipes/removeFavorite.ts';
import recipeUpdateController from './controllers/recipes/update.ts';

import newsGetAllController from './controllers/news/getAll.ts';
import newsGetByRecipeController from './controllers/news/getByRecipe.ts';
import validateRequest from './middleware/validateRequest.ts';

import { createFavoriteParam } from './controllers/recipes/addFavorite/schema.ts';
import { createRecipeBody } from './controllers/recipes/create/schema.ts';
import { recipeSchemaQuery } from './controllers/recipes/getAll/schema.ts';
import { getOneRecipeParamSchema } from './controllers/recipes/getOne/schema.ts';
import getOne from './controllers/users/getOne.ts';
import { createAuthMiddleware } from './middleware/auth.ts';
import { recipeIdParamSchema, recipeUpdateInputSchema } from './schemas/recipe.ts';
import type { AppState, ExtendedAppContext } from './types.ts';

const router = new Router<AppState, ExtendedAppContext>({});

const withCookieAuth = createAuthMiddleware({});
const withBearerAuth = createAuthMiddleware({ useAuthorizationHeader: true });

router.post('/users', withBearerAuth, userCreateController);
router.get('/users/:username', withCookieAuth, userGetOneController);

router.post(
  '/recipes',
  withCookieAuth,
  validateRequest({ body: createRecipeBody }),
  recipeCreateController,
);

router.get(
  '/recipes',
  withCookieAuth,
  validateRequest({ query: recipeSchemaQuery }),
  recipeGetAllController,
);
router.get(
  '/recipes/:slug',
  withCookieAuth,
  validateRequest({ params: getOneRecipeParamSchema }),
  recipeGetOneController,
);
router.put(
  '/recipes/:id',
  withCookieAuth,
  validateRequest({ params: recipeIdParamSchema, body: recipeUpdateInputSchema }),
  recipeUpdateController,
);
router.delete(
  '/recipes/:id',
  withCookieAuth,
  validateRequest({ params: recipeIdParamSchema }),
  recipeDeleteController,
);

router.post(
  '/recipes/:slug/favorite',
  withCookieAuth,
  validateRequest({ params: createFavoriteParam }),
  recipeAddFavoriteController,
);
router.delete(
  '/recipes/:id/favorite',
  withCookieAuth,
  validateRequest({ params: recipeIdParamSchema }),
  recipeRemoveFavoriteController,
);
router.get(
  '/recipes/favorites',
  withCookieAuth,
  validateRequest({ query: paginationSchema }),
  recipeFavoritesController,
);
router.get('/news', validateRequest({ query: paginationSchema }), newsGetAllController);
router.get(
  '/recipes/:id/news',
  withCookieAuth,
  validateRequest({ params: recipeIdParamSchema, query: paginationSchema }),
  newsGetByRecipeController,
);

export default router;
