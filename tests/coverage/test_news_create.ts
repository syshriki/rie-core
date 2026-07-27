/**
 * Tests for news creation endpoint
 */

import type { Server } from 'node:http';
import { expect } from 'chai';
import request from 'supertest';
import app from '../../src/app.ts';
import type { Output as UserOutput } from '../../src/types/public/users/create.ts';
import { nockJwks } from '../helpers/auth.ts';
import { reinitializeDatabase } from '../helpers/dbHelpers.ts';
import { createRecipe } from '../helpers/recipeHelper.ts';
import { createUser } from '../helpers/userHelper.ts';
import users from '../helpers/users.json' with { type: 'json' };

describe('/news POST', () => {
  let server: Server;
  let user: UserOutput;

  before(async () => {
    server = await app();
    nockJwks();
  });

  beforeEach(async () => {
    await reinitializeDatabase();
    user = await createUser(server, users.user0.token);
  });

  after(async () => {
    await new Promise<void>((resolve) => {
      server.close(() => resolve());
    });
  });

  it('should create a news item successfully', async () => {
    const newsData = {
      title: 'Test News Item',
      text: 'This is a test news item',
      type: 'announcement',
    };

    const response = await request(server)
      .post('/news')
      .set('Cookie', [`access_token=${users.user0.token}`])
      .send(newsData)
      .expect(201);

    expect(response.body).to.have.property('id').that.is.a('number');
    expect(response.body).to.have.property('title', newsData.title);
    expect(response.body).to.have.property('text', newsData.text);
    expect(response.body).to.have.property('type', newsData.type);
    expect(response.body).to.have.property('authorId', user.id);
  });

  it('should 200 when specifying recipe slug', async () => {
    const recipeResponse = await createRecipe(server, users.user0.token);

    const recipeSlug = recipeResponse.slug;

    const newsData = {
      title: 'Recipe News',
      text: 'News about a recipe',
      type: 'recipe',
      recipeSlug,
    };

    const response = await request(server)
      .post('/news')
      .set('Cookie', [`access_token=${users.user0.token}`])
      .send(newsData)
      .expect(201);

    expect(response.body).to.have.property('id').that.is.a('number');
    expect(response.body).to.have.property('title', newsData.title);
    expect(response.body).to.have.property('text', newsData.text);
    expect(response.body).to.have.property('type', newsData.type);
    expect(response.body).to.have.property('recipeSlug', recipeSlug);
    expect(response.body).to.have.property('authorId', user.id);
  });

  it('should 400 when specifying bad recipe slug', async () => {
    const newsData = {
      title: 'Recipe News',
      text: 'News about a recipe',
      type: 'recipe',
      recipeSlug: 'bad-sliug',
    };

    const { body } = await request(server)
      .post('/news')
      .set('Cookie', [`access_token=${users.user0.token}`])
      .send(newsData)
      .expect(400);

    expect(body).to.have.property('code', 'RECIPE_NOT_FOUND');
  });

  it('should 400 if title is too short', async () => {
    const invalidData = {
      title: '',
    };

    const response = await request(server)
      .post('/news')
      .set('Cookie', [`access_token=${users.user0.token}`])
      .send(invalidData)
      .expect(400);

    expect(response.body).to.have.property('code', 'INPUT_TOO_SMALL');
  });

  it('should 401 if missing authentication', async () => {
    const newsData = {
      title: 'Test News',
      text: 'This requires authentication',
      type: 'announcement',
    };

    await request(server).post('/news').send(newsData).expect(401);
  });
});
