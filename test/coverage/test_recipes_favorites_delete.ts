import type { Server } from 'node:http';
import request from 'supertest';
import app from '../../src/app.ts';
import type { RecipeEntity } from '../../src/schemas/recipe.ts';
import { nockJwks } from '../helpers/auth.ts';
import { reinitializeDatabase } from '../helpers/dbHelpers.ts';
import { createRecipe } from '../helpers/recipeHelper.ts';
import { createUser } from '../helpers/userHelper.ts';
import users from '../helpers/users.json' with { type: 'json' };

describe('DELETE /recipes/:id/favorite', () => {
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

  it('should remove a recipe from favorites', async () => {
    // First add to favorites
    await request(server)
      .post(`/recipes/${recipe.slug}/favorite`)
      .set('Cookie', [`access_token=${users.user0.token}`])
      .expect(201);

    // Then remove from favorites
    await request(server)
      .delete(`/recipes/${recipe.slug}/favorite`)
      .set('Cookie', [`access_token=${users.user0.token}`])
      .expect(204);

    // Verify it's removed by trying to add it again
    await request(server)
      .post(`/recipes/${recipe.slug}/favorite`)
      .set('Cookie', [`access_token=${users.user0.token}`])
      .expect(201);
  });

  it('should return 404 if recipe was not favorited', async () => {
    await request(server)
      .delete(`/recipes/${recipe.slug}/favorite`)
      .set('Cookie', [`access_token=${users.user0.token}`])
      .expect(404);
  });
});
