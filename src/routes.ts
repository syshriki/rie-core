import Router from 'koa-router';
import { paginationSchema } from './schemas/index.ts';

import userCreateController from './controllers/users/create/index.ts';
import userGetOneController from './controllers/users/getOne.ts';

import recipeAddFavoriteController from './controllers/recipes/addFavorite.ts';
import recipeCreateController from './controllers/recipes/create.ts';
import recipeDeleteController from './controllers/recipes/delete.ts';
import recipeGetAllController from './controllers/recipes/getAll.ts';
import recipeGetOneController from './controllers/recipes/getOne.ts';
import recipeFavoritesController from './controllers/recipes/getUserFavorites.ts';
import recipeRemoveFavoriteController from './controllers/recipes/removeFavorite.ts';
import recipeUpdateController from './controllers/recipes/update.ts';

import newsGetAllController from './controllers/news/getAll.ts';
import newsGetByRecipeController from './controllers/news/getByRecipe.ts';
import validateRequest from './middleware/validateRequest.ts';

import { createAuthMiddleware } from './middleware/auth.ts';
import {
  recipeCreateInputSchema,
  recipeIdParamSchema,
  recipeSearchQuerySchema,
  recipeUpdateInputSchema,
} from './schemas/recipe.ts';
import { userCreateInputSchema } from './schemas/user.ts';

const router = new Router({});

const withCookieAuth = createAuthMiddleware({});
const withBearerAuth = createAuthMiddleware({ useAuthorizationHeader: true });

router.post('/users', withBearerAuth, userCreateController);
router.get('/users/:username', withCookieAuth, userGetOneController);
router.get(
  '/recipes',
  withCookieAuth,
  validateRequest({ query: recipeSearchQuerySchema }),
  recipeGetAllController,
);
router.get(
  '/recipes/:id',
  withCookieAuth,
  validateRequest({ params: recipeIdParamSchema }),
  recipeGetOneController,
);
router.post(
  '/recipes',
  withCookieAuth,
  validateRequest({ body: recipeCreateInputSchema }),
  recipeCreateController,
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
  '/recipes/:id/favorite',
  withCookieAuth,
  validateRequest({ params: recipeIdParamSchema }),
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
