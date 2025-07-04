import Router from 'koa-router';
import * as validate from './middleware/validate.ts';
import { paginationSchema } from './schemas/index.ts';

import userCreateController from './controllers/users/create.ts';
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

import initController from './controllers/signup/index.ts';
import auth from './middleware/auth.ts';
import {
  recipeCreateInputSchema,
  recipeIdParamSchema,
  recipeSearchQuerySchema,
  recipeUpdateInputSchema,
} from './schemas/recipe.ts';
import { userCreateInputSchema } from './schemas/user.ts';

const routerProtected = new Router({ prefix: '/api' });
const routerUnprotected = new Router({ prefix: '/api' });

routerProtected.use(auth);

routerProtected.post('/signup', initController);
routerProtected.post('/users', validate.body(userCreateInputSchema), userCreateController);
routerProtected.get('/users/:username', userGetOneController);
routerProtected.get('/recipes', validate.query(recipeSearchQuerySchema), recipeGetAllController);
routerProtected.get('/recipes/:id', validate.params(recipeIdParamSchema), recipeGetOneController);
routerProtected.post('/recipes', validate.body(recipeCreateInputSchema), recipeCreateController);
routerProtected.put(
  '/recipes/:id',
  validate.params(recipeIdParamSchema),
  validate.body(recipeUpdateInputSchema),
  recipeUpdateController,
);
routerProtected.delete(
  '/recipes/:id',
  validate.params(recipeIdParamSchema),
  recipeDeleteController,
);

routerProtected.post(
  '/recipes/:id/favorite',
  validate.params(recipeIdParamSchema),
  recipeAddFavoriteController,
);
routerProtected.delete(
  '/recipes/:id/favorite',
  validate.params(recipeIdParamSchema),
  recipeRemoveFavoriteController,
);
routerProtected.get(
  '/recipes/favorites',
  validate.query(paginationSchema),
  recipeFavoritesController,
);
routerProtected.get('/news', validate.query(paginationSchema), newsGetAllController);
routerProtected.get(
  '/recipes/:id/news',
  validate.params(recipeIdParamSchema),
  validate.query(paginationSchema),
  newsGetByRecipeController,
);

const combinedRouter = new Router();
combinedRouter.use(routerProtected.routes(), routerProtected.allowedMethods());
combinedRouter.use(routerUnprotected.routes(), routerUnprotected.allowedMethods());

export default combinedRouter;
