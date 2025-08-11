import type { Server } from 'node:http';
import request from 'supertest';
import app from '../../src/app.ts';
import type { RecipeEntity } from '../../src/schemas/recipe.ts';
import { nockJwks } from '../helpers/auth.ts';
import { reinitializeDatabase } from '../helpers/dbHelpers.ts';
import { createFavorite, createRecipe } from '../helpers/recipeHelper.ts';
import { createUser } from '../helpers/userHelper.ts';
import users from '../helpers/users.json' with { type: 'json' };

describe('/recipes/:slug/favorite DELETE', () => {
  let server: Server;
  let recipe: RecipeEntity;

  before(async () => {
    server = await app();
    nockJwks();
  });

  after(async () => {
    await new Promise<void>((resolve) => {
      server.close(() => resolve());
    });
  });

  beforeEach(async () => {
    await reinitializeDatabase();

    await createUser(server, users.user0.token);
    recipe = await createRecipe(server, users.user0.token);
  });

  it('should 204 if removal successful', async () => {
    await createFavorite(server, users.user0.token, recipe.slug);

    await request(server)
      .delete(`/recipes/${recipe.slug}/favorite`)
      .set('Cookie', [`access_token=${users.user0.token}`])
      .expect(204);
  });

  it('should 400 if removal failed', async () => {
    await request(server)
      .delete(`/recipes/${recipe.slug}/favorite`)
      .set('Cookie', [`access_token=${users.user0.token}`])
      .expect(400);
  });
});
