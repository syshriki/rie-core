/**
 * Tests for recipe retrieval endpoint - Direct Import Pattern
 */

import type { Server } from 'node:http';
import { expect } from 'chai';
import request from 'supertest';
import app from '../../src/app.ts';
import { reinitializeDatabase } from '../helpers/dbHelpers.ts';

describe('GET /api/recipes/:id', () => {
  let server: Server;
  const testUsername = 'testuser';
  const testRecipe = {
    title: 'Test Recipe',
    description: 'A test recipe description',
    ingredients: ['Ingredient 1', 'Ingredient 2'],
    instructions: ['Step 1', 'Step 2'],
  };
  let recipeId: number;

  // Explicitly create server in the test file
  before(async () => {
    server = await app();
  });

  // Explicitly close server in the test file
  after(async () => {
    await new Promise<void>((resolve) => {
      server.close(() => resolve());
    });
  });

  // Clean up database and create test user and recipe before tests
  beforeEach(async () => {
    await reinitializeDatabase();

    // Create test user directly in the test
    await request(server).post('/api/users').send({ username: testUsername }).expect(201);

    // Create a test recipe
    const response = await request(server)
      .post('/api/recipes')
      .set('X-Username', testUsername)
      .send(testRecipe)
      .expect(201);

    recipeId = response.body.id;
  });

  it('should get a specific recipe by ID', async () => {
    const response = await request(server)
      .get(`/api/recipes/${recipeId}`)
      .set('X-Username', testUsername)
      .expect(200);

    expect(response.body).to.have.property('id', recipeId);
    expect(response.body).to.have.property('title', testRecipe.title);
    expect(response.body).to.have.property('description', testRecipe.description);
    expect(response.body).to.have.property('ingredients').that.deep.equals(testRecipe.ingredients);
    expect(response.body)
      .to.have.property('instructions')
      .that.deep.equals(testRecipe.instructions);
    expect(response.body).to.have.property('username', testUsername);
  });

  it('should return 404 for non-existent recipe', async () => {
    const nonExistentId = 9999;

    await request(server)
      .get(`/api/recipes/${nonExistentId}`)
      .set('X-Username', testUsername)
      .expect(404);
  });

  it('should include favorite status for the authenticated user', async () => {
    // First add recipe to favorites
    await request(server)
      .post(`/api/recipes/${recipeId}/favorite`)
      .set('X-Username', testUsername)
      .expect(201);

    // Then check that the recipe includes favorite status
    const response = await request(server)
      .get(`/api/recipes/${recipeId}`)
      .set('X-Username', testUsername)
      .expect(200);

    expect(response.body).to.have.property('favorited', true);
  });
});
