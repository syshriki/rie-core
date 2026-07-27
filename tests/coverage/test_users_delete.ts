/**
 * Tests for user deletion endpoint
 */

import type { Server } from 'node:http';
import { expect } from 'chai';
import request from 'supertest';
import app from '../../src/app.ts';
import type { Output as UserOutput } from '../../src/types/public/users/create.ts';
import { nockJwks } from '../helpers/auth.ts';
import { reinitializeDatabase } from '../helpers/dbHelpers.ts';
import { createFavorite, createRecipe } from '../helpers/recipeHelper.ts';
import { createUser } from '../helpers/userHelper.ts';
import users from '../helpers/users.json' with { type: 'json' };

describe('/users/:id DELETE', () => {
  let server: Server;
  let user0: UserOutput;
  let user1: UserOutput;

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
    user0 = await createUser(server, users.user0.token);
    user1 = await createUser(server, users.user1.token);
  });

  it('should 204 when user deletes themselves', async () => {
    await request(server)
      .delete(`/users/${user0.id}`)
      .set('Cookie', [`access_token=${users.user0.token}`])
      .expect(204);
  });

  it('should delete all user data in a single transaction', async () => {
    // Create recipes for user0
    const recipe1 = await createRecipe(server, users.user0.token);
    const recipe2 = await createRecipe(server, users.user0.token, {
      title: 'Another Recipe',
      description: 'Another test recipe description',
      recipe: 'step1 step2 step3',
      ingredients: 'ingredient1, ingredient2, ingredient3',
    });

    // user1 favorites user0's recipes
    await createFavorite(server, users.user1.token, recipe1.slug);
    await createFavorite(server, users.user1.token, recipe2.slug);

    // user0 favorites user1's recipe
    const user1Recipe = await createRecipe(server, users.user1.token);
    await createFavorite(server, users.user0.token, user1Recipe.slug);

    // Delete user0
    await request(server)
      .delete(`/users/${user0.id}`)
      .set('Cookie', [`access_token=${users.user0.token}`])
      .expect(204);

    // Verify user0 no longer exists (trying to get /me with user0 token should fail)
    await request(server)
      .get('/users/me')
      .set('Cookie', [`access_token=${users.user0.token}`])
      .expect(400);

    // Verify user0's recipes are gone (anonymous endpoint returns 400 not found)
    await request(server)
      .get(`/anonymous/recipes/${recipe1.slug}`)
      .expect(400);

    await request(server)
      .get(`/anonymous/recipes/${recipe2.slug}`)
      .expect(400);
  });

  it('should 403 when trying to delete another user', async () => {
    const { body } = await request(server)
      .delete(`/users/${user0.id}`)
      .set('Cookie', [`access_token=${users.user1.token}`])
      .expect(403);

    expect(body).to.have.property('code', 'UNAUTHORIZED_DELETE');
  });

  it('should 400 when user does not exist', async () => {
    // This token's sub doesn't match any existing user in the DB
    // because user2 was never created via POST /users
    await request(server)
      .delete('/users/2')
      .set('Cookie', [`access_token=${users.user2.token}`])
      .expect(400);
  });

  it('should 401 when no auth token provided', async () => {
    await request(server)
      .delete(`/users/${user0.id}`)
      .expect(401);
  });
});
