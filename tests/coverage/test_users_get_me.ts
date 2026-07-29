import type { Server } from 'node:http';
import { expect } from 'chai';
import request from 'supertest';
import app from '../../src/app.ts';
import type { Output as UserOutput } from '../../src/controllers/users/create/types.ts';
import { nockJwks } from '../helpers/auth.ts';
import { reinitializeDatabase } from '../helpers/dbHelpers.ts';
import { createFavorite, createRecipe } from '../helpers/recipeHelper.ts';
import { createUser } from '../helpers/userHelper.ts';
import users from '../helpers/users.json' with { type: 'json' };

describe('/users/me GET', () => {
  let server: Server;
  let user0: UserOutput;

  before(async () => {
    server = await app();
    nockJwks();
  });

  beforeEach(async () => {
    await reinitializeDatabase();
    user0 = await createUser(server, users.user0.token);
    // Create another user for comparison
    await createUser(server, users.user1.token);
  });

  after(async () => {
    await new Promise<void>((resolve) => {
      server.close(() => resolve());
    });
  });

  it('should 200 when getting current user profile', async () => {
    const response = await request(server)
      .get('/users/me')
      .set('Cookie', [`access_token=${users.user0.token}`])
      .expect(200);

    expect(response.body).to.have.property('id', user0.id);
    expect(response.body).to.have.property('username', user0.username);
    expect(response.body).to.have.property('favoriteCount', 0);
    expect(response.body).to.have.property('recipeCount', 0);
    expect(response.body).to.have.property('createdAt').that.is.a('string');
  });

  it('should return recipe count and favorite count for current user', async () => {
    // Create recipes for user1
    const recipe1 = await createRecipe(server, users.user1.token);
    const recipe2 = await createRecipe(server, users.user1.token, {
      title: 'Another Recipe',
      description: 'Another test recipe description',
      recipe: 'step1 step2 step3',
      ingredients: 'ingredient1, ingredient2, ingredient3',
    });

    // Create favorites for user0
    await createFavorite(server, users.user0.token, recipe1.slug);
    await createFavorite(server, users.user0.token, recipe2.slug);

    // Get user0 profile (me) with counts
    const response = await request(server)
      .get('/users/me')
      .set('Cookie', [`access_token=${users.user0.token}`])
      .expect(200);

    // Check if the response includes recipe and favorite counts
    expect(response.body).to.have.property('id', user0.id);
    expect(response.body).to.have.property('recipeCount', 0);
    expect(response.body).to.have.property('favoriteCount', 2);
  });

  it('should require authentication', async () => {
    await request(server).get('/users/me').expect(401);
  });
});
