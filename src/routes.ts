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

import {
  recipeCreateInputSchema,
  recipeIdParamSchema,
  recipeSearchQuerySchema,
  recipeUpdateInputSchema,
} from './schemas/recipe.ts';
import { userCreateInputSchema } from './schemas/user.ts';
import auth from './middleware/auth.ts';
import initController from './controllers/init.ts';

const router = new Router({ prefix: '/api' });

router.use(auth);

router.post('/init', initController);
router.post('/users', validate.body(userCreateInputSchema), userCreateController);
router.get('/users/:username', userGetOneController);
router.get('/recipes', validate.query(recipeSearchQuerySchema), recipeGetAllController);
router.get('/recipes/:id', validate.params(recipeIdParamSchema), recipeGetOneController);
router.post('/recipes', validate.body(recipeCreateInputSchema), recipeCreateController);
router.put(
  '/recipes/:id',
  validate.params(recipeIdParamSchema),
  validate.body(recipeUpdateInputSchema),
  recipeUpdateController
);
router.delete('/recipes/:id', validate.params(recipeIdParamSchema), recipeDeleteController);

router.post(
  '/recipes/:id/favorite',
  validate.params(recipeIdParamSchema),
  recipeAddFavoriteController
);
router.delete(
  '/recipes/:id/favorite',
  validate.params(recipeIdParamSchema),
  recipeRemoveFavoriteController
);
router.get('/recipes/favorites', validate.query(paginationSchema), recipeFavoritesController);
router.get('/news', validate.query(paginationSchema), newsGetAllController);
router.get(
  '/recipes/:id/news',
  validate.params(recipeIdParamSchema),
  validate.query(paginationSchema),
  newsGetByRecipeController
);

export default router;
