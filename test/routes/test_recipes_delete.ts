/**
 * Tests for recipe deletion endpoint - Direct Import Pattern
 */

import type { Server } from 'node:http';
import { expect } from 'chai';
import request from 'supertest';
import app from '../../src/app.ts';
import { reinitializeDatabase } from '../helpers/dbHelpers.ts';

// Define recipe data interface directly in test
interface RecipeData {
  title: string;
  description?: string;
  ingredients: string[];
  instructions: string[];
  [key: string]: unknown;
}

describe('DELETE /api/recipes/:id', () => {
  let server: Server;
  const testUsername = 'testuser';
  const testRecipe: RecipeData = {
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
    const userResponse = await request(server)
      .post('/api/users')
      .send({ username: testUsername })
      .expect(201);

    // Create a test recipe directly in the test
    const recipeResponse = await request(server)
      .post('/api/recipes')
      .set('X-Username', testUsername)
      .send(testRecipe)
      .expect(201);

    recipeId = recipeResponse.body.id as number;
  });

  it('should delete a recipe', async () => {
    // Delete the recipe
    await request(server)
      .delete(`/api/recipes/${recipeId}`)
      .set('X-Username', testUsername)
      .expect(204);

    // Verify it's deleted by trying to fetch it
    await request(server)
      .get(`/api/recipes/${recipeId}`)
      .set('X-Username', testUsername)
      .expect(404);
  });

  it('should return 404 for non-existent recipe', async () => {
    const nonExistentId = 9999;

    await request(server)
      .delete(`/api/recipes/${nonExistentId}`)
      .set('X-Username', testUsername)
      .expect(404);
  });

  it('should not allow deleting recipes created by others', async () => {
    // Create another user
    const otherUsername = 'otheruser';
    await request(server).post('/api/users').send({ username: otherUsername }).expect(201);

    // Try to delete as different user
    await request(server)
      .delete(`/api/recipes/${recipeId}`)
      .set('X-Username', otherUsername)
      .expect(403);

    // Verify recipe still exists
    const response = await request(server)
      .get(`/api/recipes/${recipeId}`)
      .set('X-Username', testUsername)
      .expect(200);

    expect(response.body).to.have.property('id', recipeId);
  });
});
