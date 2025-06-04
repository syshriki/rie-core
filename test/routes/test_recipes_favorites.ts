/**
 * Tests for recipe favorites endpoints - Direct Import Pattern
 */

import type { Server } from 'node:http';
import { expect } from 'chai';
import request from 'supertest';
import app from '../../src/app.ts';
import { reinitializeDatabase } from '../helpers/dbHelpers.ts';

describe('Recipe favorites endpoints', () => {
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

  describe('POST /api/recipes/:id/favorite', () => {
    it('should add a recipe to favorites', async () => {
      const response = await request(server)
        .post(`/api/recipes/${recipeId}/favorite`)
        .set('X-Username', testUsername)
        .expect(201);

      expect(response.body).to.have.property('recipeId', recipeId);
      expect(response.body).to.have.property('username', testUsername);
    });

    it('should require authentication', async () => {
      await request(server).post(`/api/recipes/${recipeId}/favorite`).expect(401);
    });

    it('should return conflict if already favorited', async () => {
      // First favorite
      await request(server)
        .post(`/api/recipes/${recipeId}/favorite`)
        .set('X-Username', testUsername)
        .expect(201);

      // Try to favorite again
      await request(server)
        .post(`/api/recipes/${recipeId}/favorite`)
        .set('X-Username', testUsername)
        .expect(409);
    });
  });

  describe('DELETE /api/recipes/:id/favorite', () => {
    it('should remove a recipe from favorites', async () => {
      // First add to favorites
      await request(server)
        .post(`/api/recipes/${recipeId}/favorite`)
        .set('X-Username', testUsername)
        .expect(201);

      // Then remove from favorites
      await request(server)
        .delete(`/api/recipes/${recipeId}/favorite`)
        .set('X-Username', testUsername)
        .expect(204);

      // Verify it's removed by trying to add it again
      await request(server)
        .post(`/api/recipes/${recipeId}/favorite`)
        .set('X-Username', testUsername)
        .expect(201);
    });

    it('should return 404 if recipe was not favorited', async () => {
      await request(server)
        .delete(`/api/recipes/${recipeId}/favorite`)
        .set('X-Username', testUsername)
        .expect(404);
    });
  });

  describe('GET /api/users/:username/favorites', () => {
    it('should return user favorites', async () => {
      // Add recipe to favorites
      await request(server)
        .post(`/api/recipes/${recipeId}/favorite`)
        .set('X-Username', testUsername)
        .expect(201);

      // Get favorites
      const response = await request(server)
        .get(`/api/users/${testUsername}/favorites`)
        .set('X-Username', testUsername)
        .expect(200);

      expect(response.body).to.have.property('recipes');
      expect(response.body.recipes).to.be.an('array').with.lengthOf(1);
      expect(response.body.recipes[0]).to.have.property('id', recipeId);
    });
  });
});
