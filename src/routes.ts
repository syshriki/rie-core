import Router from 'koa-router';

import recipeAddFavoriteController from './controllers/recipes/addFavorite/index.ts';
import recipeCreateController from './controllers/recipes/create/index.ts';
import recipeDeleteController from './controllers/recipes/delete/index.ts';
import recipeRemoveFavoriteController from './controllers/recipes/deleteFavorite/index.ts';
import recipeGetAllController from './controllers/recipes/getAll/index.ts';
import recipeGetOneController from './controllers/recipes/getOne/index.ts';
import recipeFavoritesController from './controllers/recipes/getUserFavorites.ts';
import recipeUpdateController from './controllers/recipes/update/index.ts';
import userCreateController from './controllers/users/create/index.ts';
import userGetOneController from './controllers/users/getOne/index.ts';
import { paginationSchema } from './schemas/pagination.ts';

import newsGetAllController from './controllers/news/getAll.ts';
import newsGetByRecipeController from './controllers/news/getByRecipe.ts';
import validateRequest from './middleware/validateRequest.ts';

import { createFavoriteParam } from './controllers/recipes/addFavorite/schema.ts';
import { createRecipeBody } from './controllers/recipes/create/schema.ts';
import { deleteRecipeParam } from './controllers/recipes/delete/schema.ts';
import { deleteFavoriteParam } from './controllers/recipes/deleteFavorite/schema.ts';
import { recipeSchemaQuery } from './controllers/recipes/getAll/schema.ts';
import { getOneRecipeParamSchema } from './controllers/recipes/getOne/schema.ts';
import {
  updateRecipeBodySchema,
  updateRecipeParamSchema,
} from './controllers/recipes/update/schema.ts';
import { getOneUserParam } from './controllers/users/getOne/schema.ts';
import { createAuthMiddleware } from './middleware/auth.ts';
import { recipeIdParamSchema } from './schemas/recipe.ts';
import type { AppState, ExtendedAppContext } from './types.ts';

const router = new Router<AppState, ExtendedAppContext>({});

const withCookieAuth = createAuthMiddleware({});
const withBearerAuth = createAuthMiddleware({ useAuthorizationHeader: true });

router.post('/users', withBearerAuth, userCreateController);
router.get(
  '/users/:id',
  withCookieAuth,
  validateRequest({ params: getOneUserParam }),
  userGetOneController,
);

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
  '/recipes/:slug',
  withCookieAuth,
  validateRequest({
    params: updateRecipeParamSchema,
    body: updateRecipeBodySchema,
  }),
  recipeUpdateController,
);
router.delete(
  '/recipes/:slug',
  withCookieAuth,
  validateRequest({ params: deleteRecipeParam }),
  recipeDeleteController,
);

router.post(
  '/recipes/:slug/favorite',
  withCookieAuth,
  validateRequest({ params: createFavoriteParam }),
  recipeAddFavoriteController,
);
router.delete(
  '/recipes/:slug/favorite',
  withCookieAuth,
  validateRequest({ params: deleteFavoriteParam }),
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
