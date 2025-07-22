/**
 * Tests for recipe deletion endpoint - Direct Import Pattern
 */

import type { Server } from 'node:http';
import { expect } from 'chai';
import request from 'supertest';
import app from '../../src/app.ts';
import type { RecipeEntity } from '../../src/schemas/recipe.ts';
import { nockJwks } from '../helpers/auth.ts';
import { reinitializeDatabase } from '../helpers/dbHelpers.ts';
import { createFavorite, createRecipe } from '../helpers/recipeHelper.ts';
import { createUser } from '../helpers/userHelper.ts';
import users from '../helpers/users.json' with { type: 'json' };

describe('DELETE /recipes/:slug', () => {
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

  it('should 204 when recipe is deleted', async () => {
    await createFavorite(server, users.user0.token, recipe.slug);
    await request(server)
      .delete(`/recipes/${recipe.slug}`)
      .set('Cookie', [`access_token=${users.user0.token}`])
      .expect(204);
  });

  it('should 400 if already deleted', async () => {
    await request(server)
      .delete(`/recipes/${recipe.slug}`)
      .set('Cookie', [`access_token=${users.user0.token}`])
      .expect(204);

    const { body } = await request(server)
      .delete(`/recipes/${recipe.slug}`)
      .set('Cookie', [`access_token=${users.user0.token}`])
      .expect(400);

    expect(body).to.have.property('code', 'RECIPE_NOT_FOUND');
  });

  it("should 403 when deleting another user's recipe", async () => {
    await createUser(server, users.user1.token);

    const { body } = await request(server)
      .delete(`/recipes/${recipe.slug}`)
      .set('Cookie', [`access_token=${users.user1.token}`])
      .expect(403);

    expect(body).to.have.property('code', 'UNAUTHORIZED_DELETE');
  });
});
