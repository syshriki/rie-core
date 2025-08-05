/**
 * Tests for anonymous recipes listing endpoint
 */

import type { Server } from 'node:http';
import { expect } from 'chai';
import request from 'supertest';
import app from '../../src/app.ts';
import { nockJwks } from '../helpers/auth.ts';
import { reinitializeDatabase } from '../helpers/dbHelpers.ts';
import { createFavorite, createRecipe } from '../helpers/recipeHelper.ts';
import { createUser } from '../helpers/userHelper.ts';
import users from '../helpers/users.json' with { type: 'json' };

describe('GET /anonymous/recipes', () => {
  let server: Server;
  const testRecipe = {
    title: 'Test Recipe',
    description: 'A test recipe description',
    recipe: 'step1 step2',
    ingredients: 'ingredient1, ingredient2',
  };

  // Setup server before all tests
  before(async () => {
    server = await app();
    nockJwks();
  });

  after(async () => {
    await new Promise<void>((resolve) => {
      server.close(() => resolve());
    });
  });

  // Clean up database and create test user before tests
  beforeEach(async () => {
    await reinitializeDatabase();

    await createUser(server, users.user0.token);
    await createUser(server, users.user1.token);

    // Create test recipes
    await createRecipe(server, users.user0.token, {
      ...testRecipe,
      title: 'Recipe 1',
      description: 'First test recipe',
    });

    await createRecipe(server, users.user0.token, {
      ...testRecipe,
      title: 'Recipe 2',
      description: 'Second test recipe',
    });
  });

  it('should return recipes without requiring authentication', async () => {
    const response = await request(server).get('/anonymous/recipes').expect(200);

    expect(response.body).to.have.property('recipes').that.is.an('array');
    expect(response.body.recipes).to.have.length(2);
    expect(response.body).to.have.property('hasMore', false);
    expect(response.body).to.have.property('nextCursor', null);
  });

  it('should filter recipes by search term', async () => {
    const response = await request(server).get('/anonymous/recipes?q=First').expect(200);

    expect(response.body.recipes).to.have.length(1);
    expect(response.body.recipes[0].title).to.equal('Recipe 1');
  });

  it('should paginate results correctly', async () => {
    // Create 10 more recipes for pagination testing
    for (let i = 0; i < 10; i++) {
      await createRecipe(server, users.user0.token, {
        ...testRecipe,
        title: `Pagination Test ${i}`,
      });
    }

    const response = await request(server).get('/anonymous/recipes?limit=5').expect(200);

    expect(response.body.recipes).to.have.length(5);
    expect(response.body).to.have.property('hasMore', true);
    expect(response.body).to.have.property('nextCursor').that.is.a('string');

    // Get next page
    const nextPage = await request(server)
      .get(`/anonymous/recipes?limit=5&cursor=${response.body.nextCursor}`)
      .expect(200);

    expect(nextPage.body.recipes).to.have.length(5);
    expect(nextPage.body.recipes).to.not.deep.equal(response.body.recipes);
  });

  it('should mark all recipes as not favorited for anonymous users', async () => {
    // Add a favorite for an authenticated user
    const recipe1 = await createRecipe(server, users.user0.token, {
      ...testRecipe,
      title: 'Favorite Test',
    });
    await createFavorite(server, users.user1.token, recipe1.slug);

    const response = await request(server).get('/anonymous/recipes?q=Favorite').expect(200);

    expect(response.body.recipes).to.have.length(1);
    expect(response.body.recipes[0]).to.have.property('isFavorite', false);
  });
});
