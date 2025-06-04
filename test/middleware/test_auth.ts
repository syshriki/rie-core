/**
 * Tests for recipe creation endpoint - Direct Import Pattern
 */

import type { Server } from 'node:http';
import { expect } from 'chai';
import request from 'supertest';
import app from '../../src/app.ts';
import { reinitializeDatabase } from '../helpers/dbHelpers.ts';

describe('middleware auth', () => {
  let server: Server;
  const testUsername = 'testuser';
  const testRecipe = {
    title: 'Test Recipe',
    description: 'A test recipe description',
    ingredients: ['Ingredient 1', 'Ingredient 2'],
    instructions: ['Step 1', 'Step 2'],
  };

  // Explicitly create server in each test suite
  before(async () => {
    server = await app();
  });

  // Explicit teardown in the test file
  after(async () => {
    await new Promise<void>((resolve) => {
      server.close(() => resolve());
    });
  });

  beforeEach(async () => {
    await reinitializeDatabase();
    console.log(process.env.NODE_ENV)
    // Create test user directly in the test
    await request(server).post('/api/users').send({ username: testUsername }).expect(201);
  });

  it('should create a new recipe', async () => {
    const response = await request(server)
      .post('/api/recipes')
      .set('X-Username', testUsername)
      .send(testRecipe)
      .expect(201);

    expect(response.body).to.have.property('id').that.is.a('number');
    expect(response.body).to.have.property('title', testRecipe.title);
    expect(response.body).to.have.property('description', testRecipe.description);
    expect(response.body).to.have.property('ingredients').that.deep.equals(testRecipe.ingredients);
    expect(response.body)
      .to.have.property('instructions')
      .that.deep.equals(testRecipe.instructions);
    expect(response.body).to.have.property('username', testUsername);
    expect(response.body).to.have.property('createdAt').that.is.a('number');
  });

  it('should require a valid username', async () => {
    await request(server)
      .post('/api/recipes')
      .send(testRecipe) // Missing username header
      .expect(400); // Should fail with a 400 status
  });

  it('should require recipe data', async () => {
    await request(server)
      .post('/api/recipes')
      .set('X-Username', testUsername)
      .send({}) // Empty recipe data
      .expect(400); // Should fail with validation error
  });
});
