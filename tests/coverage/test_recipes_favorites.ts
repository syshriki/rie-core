/**
 * Tests for recipe favorites endpoints - Direct Import Pattern
 */

import type { Server } from 'node:http';
import { expect } from 'chai';
import request from 'supertest';
import app from '../../src/app.ts';
import type { RecipeEntity } from '../../src/schemas/recipe.ts';
import type { UserEntity } from '../../src/schemas/user.ts';
import { nockJwks } from '../helpers/auth.ts';
import { reinitializeDatabase } from '../helpers/dbHelpers.ts';
import { createRecipe } from '../helpers/recipeHelper.ts';
import { createUser } from '../helpers/userHelper.ts';
import users from '../helpers/users.json' with { type: 'json' };

describe('/recipes/:slug/favorite POST', () => {
  let server: Server;
  let recipe: RecipeEntity;
  let user: UserEntity;

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

    user = await createUser(server, users.user0.token);
    recipe = await createRecipe(server, users.user0.token);
  });

  it('should add a recipe to favorites', async () => {
    const response = await request(server)
      .post(`/recipes/${recipe.slug}/favorite`)
      .set('Cookie', [`access_token=${users.user0.token}`])
      .expect(200);

    expect(response.body).to.have.property('recipeSlug', recipe.slug);
    expect(response.body).to.have.property('userId', user.id);
  });

  it('should require authentication', async () => {
    await request(server).post(`/recipes/${recipe.slug}/favorite`).expect(401);
  });

  it('should 200 if already favorited', async () => {
    await request(server)
      .post(`/recipes/${recipe.slug}/favorite`)
      .set('Cookie', [`access_token=${users.user0.token}`])
      .expect(200);

    await request(server)
      .post(`/recipes/${recipe.slug}/favorite`)
      .set('Cookie', [`access_token=${users.user0.token}`])
      .expect(204);
  });
});
