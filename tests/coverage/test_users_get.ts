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

describe('/users/:id GET', () => {
  let server: Server;
  let user0: UserOutput;
  let user1: UserOutput;

  before(async () => {
    server = await app();
    await nockJwks();
  });

  beforeEach(async () => {
    await reinitializeDatabase();
    user0 = await createUser(server, users.user0.token);
    user1 = await createUser(server, users.user1.token);
  });

  after(async () => {
    await new Promise<void>((resolve) => {
      server.close(() => resolve());
    });
  });

  it('should 200 getting user by id', async () => {
    const response = await request(server)
      .get(`/users/${user1.id}`)
      .set('Cookie', [`access_token=${users.user0.token}`])
      .expect(200);

    expect(response.body).to.have.property('id', user1.id);
    expect(response.body).to.have.property('createdAt').that.is.a('string');
  });

  it('should 400 when specifying non-existent user', async () => {
    const { body } = await request(server)
      .get('/users/2')
      .set('Cookie', [`access_token=${users.user0.token}`])
      .expect(400);
    expect(body).to.have.property('code', 'USER_NOT_FOUND');
  });

  it('should return recipe count and favorite count for a user', async () => {
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

    // Get user1 profile with counts
    const response = await request(server)
      .get(`/users/${user1.id}`)
      .set('Cookie', [`access_token=${users.user0.token}`])
      .expect(200);

    // Check if the response includes recipe and favorite counts
    expect(response.body).to.have.property('id', user1.id);
    expect(response.body).to.have.property('recipeCount', 2);
    expect(response.body).to.have.property('favoriteCount', 0);

    // Get user0 profile with counts
    const response2 = await request(server)
      .get(`/users/${user0.id}`)
      .set('Cookie', [`access_token=${users.user0.token}`])
      .expect(200);

    // Check if the response includes recipe and favorite counts
    expect(response2.body).to.have.property('id', user0.id);
    expect(response2.body).to.have.property('recipeCount', 0);
    expect(response2.body).to.have.property('favoriteCount', 2);
  });

  it('should require authentication', async () => {
    await request(server).get('/users/1').expect(401);
  });
});
