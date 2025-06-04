/**
 * Tests for recipes listing endpoint
 */

import type { Server } from 'node:http';
import { expect } from 'chai';
import request from 'supertest';
import app from '../../src/app.ts';
import { reinitializeDatabase } from '../helpers/dbHelpers.ts';

describe('GET /api/recipes', () => {
  let server: Server;
  const testUsername = 'testuser';
  const testRecipe = {
    title: 'Test Recipe',
    description: 'A test recipe description',
    ingredients: ['Ingredient 1', 'Ingredient 2'],
    instructions: ['Step 1', 'Step 2'],
  };

  // Setup server before all tests
  before(async () => {
    server = await app();
  });

  after(async () => {
    await new Promise<void>((resolve) => {
      server.close(() => resolve());
    });
  });

  // Clean up database and create test user before tests
  beforeEach(async () => {
    await reinitializeDatabase();

    // Get the await request(server) instance after server setup
    // Create some test recipes
    await request(server)
      .post('/api/recipes')
      .set('X-Username', testUsername)
      .send({
        ...testRecipe,
        title: 'Recipe 1',
      });

    await request(server)
      .post('/api/recipes')
      .set('X-Username', testUsername)
      .send({
        ...testRecipe,
        title: 'Recipe 2',
      });
  });

  it('should get all recipes with pagination', async () => {
    const response = await request(server)
      .get('/api/recipes')
      .set('X-Username', testUsername)
      .expect(200);

    expect(response.body).to.have.property('recipes').that.is.an('array');
    expect(response.body.recipes).to.have.length(2);
    expect(response.body).to.have.property('hasMore', false);
    expect(response.body.recipes[0]).to.have.property('title', 'Recipe 2'); // Most recent first
  });

  it('should filter recipes by search term', async () => {
    const response = await request(server)
      .get('/api/recipes?q=Recipe 1')
      .set('X-Username', testUsername)
      .expect(200);

    expect(response.body).to.have.property('recipes').that.is.an('array');
    expect(response.body.recipes).to.have.length(1);
    expect(response.body.recipes[0]).to.have.property('title', 'Recipe 1');
  });
});
