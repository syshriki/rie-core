/**
 * Tests for recipe update endpoint - Direct Import Pattern
 */

import type { Server } from 'node:http';
import { expect } from 'chai';
import request from 'supertest';
import app from '../../src/app.ts';
import { reinitializeDatabase } from '../helpers/dbHelpers.ts';

describe('PUT /recipes/:id', () => {
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
    await request(server).post('/users').send({ username: testUsername }).expect(201);

    // Create a test recipe
    const response = await request(server)
      .post('/recipes')
      .set('X-Username', testUsername)
      .send(testRecipe)
      .expect(201);

    recipeId = response.body.id;
  });

  it('should update a recipe', async () => {
    const updatedRecipe = {
      title: 'Updated Recipe Title',
      description: 'Updated description',
      ingredients: ['Updated Ingredient 1', 'Updated Ingredient 2', 'New Ingredient'],
      instructions: ['Updated Step 1', 'Updated Step 2', 'New Step'],
    };

    const response = await request(server)
      .put(`/recipes/${recipeId}`)
      .set('X-Username', testUsername)
      .send(updatedRecipe)
      .expect(200);

    expect(response.body).to.have.property('id', recipeId);
    expect(response.body).to.have.property('title', updatedRecipe.title);
    expect(response.body).to.have.property('description', updatedRecipe.description);
    expect(response.body)
      .to.have.property('ingredients')
      .that.deep.equals(updatedRecipe.ingredients);
    expect(response.body)
      .to.have.property('instructions')
      .that.deep.equals(updatedRecipe.instructions);
    expect(response.body).to.have.property('username', testUsername);
  });

  it('should return 404 for non-existent recipe', async () => {
    const nonExistentId = 9999;

    await request(server)
      .put(`/recipes/${nonExistentId}`)
      .set('X-Username', testUsername)
      .send({
        title: 'Updated Recipe',
        ingredients: ['Ingredient'],
        instructions: ['Instruction'],
      })
      .expect(404);
  });

  it('should require all mandatory fields', async () => {
    // Missing instructions field
    await request(server)
      .put(`/recipes/${recipeId}`)
      .set('X-Username', testUsername)
      .send({
        title: 'Updated Recipe',
        ingredients: ['Ingredient'],
      })
      .expect(400);
  });

  it('should not allow updating recipes created by others', async () => {
    // Create another user
    const otherUsername = 'otheruser';
    await request(server).post('/users').send({ username: otherUsername }).expect(201);

    // Try to update as different user
    await request(server)
      .put(`/recipes/${recipeId}`)
      .set('X-Username', otherUsername)
      .send({
        title: 'Hijacked Recipe',
        ingredients: ['Bad Ingredient'],
        instructions: ['Bad Instruction'],
      })
      .expect(403);

    // Verify original recipe unchanged
    const response = await request(server)
      .get(`/recipes/${recipeId}`)
      .set('X-Username', testUsername)
      .expect(200);

    expect(response.body).to.have.property('title', testRecipe.title);
  });
});
