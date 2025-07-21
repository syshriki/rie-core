/**
 * Tests for news by recipe endpoint - Direct Import Pattern
 */

import type { Server } from 'node:http';
import { expect } from 'chai';
import request from 'supertest';
import app from '../../src/app.ts';
import { reinitializeDatabase } from '../helpers/dbHelpers.ts';

describe('GET /recipes/:id/news', () => {
  let server: Server;
  const testUsername = 'testuser';
  const testRecipe = {
    title: 'Test Recipe',
    description: 'A test recipe description',
    ingredients: ['Ingredient 1', 'Ingredient 2'],
    instructions: ['Step 1', 'Step 2'],
  };
  let recipeId: number;

  before(async () => {
    server = await app();
  });

  after(async () => {
    await new Promise<void>((resolve) => {
      server.close(() => resolve());
    });
  });

  async function createNewsItem(title: string, recipeId: number | null) {
    await request(server)
      .post('/news')
      .set('X-Username', testUsername)
      .send({
        title,
        content: `Content for ${title}`,
        recipeId,
      })
      .expect(201);
  }

  beforeEach(async () => {
    await reinitializeDatabase();

    await request(server).post('/users').send({ username: testUsername }).expect(201);

    // Create a test recipe
    const recipeResponse = await request(server)
      .post('/recipes')
      .set('X-Username', testUsername)
      .send(testRecipe)
      .expect(201);

    recipeId = recipeResponse.body.id;

    // Create some news items for this recipe
    await createNewsItem(`News for Recipe ${recipeId} - 1`, recipeId);
    await createNewsItem(`News for Recipe ${recipeId} - 2`, recipeId);

    // Create some general news items not attached to the recipe
    await createNewsItem('General News 1', null);
    await createNewsItem('General News 2', null);
  });

  it('should get news for a specific recipe', async () => {
    const response = await request(server)
      .get(`/recipes/${recipeId}/news`)
      .set('X-Username', testUsername)
      .expect(200);

    expect(response.body).to.have.property('news').that.is.an('array');
    expect(response.body.news).to.have.length(2);
    expect(response.body.news.every((item: any) => item.recipeId === recipeId)).to.be.true;
    expect(response.body.news[0].title).to.include(`News for Recipe ${recipeId}`);
  });

  it('should return empty array for recipe with no news', async () => {
    // Create a new recipe with no news
    const newRecipeResponse = await request(server)
      .post('/recipes')
      .set('X-Username', testUsername)
      .send({
        ...testRecipe,
        title: 'Another Recipe',
      })
      .expect(201);

    const newRecipeId = newRecipeResponse.body.id;

    const response = await request(server)
      .get(`/recipes/${newRecipeId}/news`)
      .set('X-Username', testUsername)
      .expect(200);

    expect(response.body).to.have.property('news').that.is.an('array');
    expect(response.body.news).to.have.length(0);
  });

  it('should return 404 for non-existent recipe', async () => {
    const nonExistentId = 9999;

    await request(server)
      .get(`/recipes/${nonExistentId}/news`)
      .set('X-Username', testUsername)
      .expect(404);
  });
});
