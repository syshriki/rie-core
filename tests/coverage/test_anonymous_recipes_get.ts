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

describe('/anonymous/recipes GET', () => {
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

    const response = await request(server).get('/anonymous/recipes?pageSize=5').expect(200);

    expect(response.body.recipes).to.have.length(5);
    expect(response.body).to.have.property('hasMore', true);
    expect(response.body).to.have.property('nextCursor').that.is.a('string');

    // Get next page
    const nextPage = await request(server)
      .get(`/anonymous/recipes?pageSize=5&cursor=${response.body.nextCursor}`)
      .expect(200);

    expect(nextPage.body.recipes).to.have.length(5);
    expect(nextPage.body.recipes).to.not.deep.equal(response.body.recipes);
  });

  it('should support page-based pagination without authentication', async () => {
    // Create 10 more recipes for pagination testing
    for (let i = 0; i < 10; i++) {
      await createRecipe(server, users.user0.token, {
        ...testRecipe,
        title: `Page Test ${i}`,
      });
    }

    const response = await request(server).get('/anonymous/recipes?page=1&pageSize=5').expect(200);

    expect(response.body).to.have.property('recipes').that.is.an('array');
    expect(response.body.recipes).to.have.length(5);

    expect(response.body).to.have.property('pagination');
    expect(response.body.pagination).to.have.property('currentPage', 1);
    expect(response.body.pagination).to.have.property('pageSize', 5);
    expect(response.body.pagination).to.have.property('totalPages').that.is.a('number');
    expect(response.body.pagination).to.have.property('totalItems').that.is.a('number');
    expect(response.body.pagination).to.have.property('hasNextPage').that.is.a('boolean');
    expect(response.body.pagination).to.have.property('hasPreviousPage', false);
  });

  it('should navigate through pages with page-based pagination anonymously', async () => {
    // Create more recipes for pagination testing
    for (let i = 0; i < 15; i++) {
      await createRecipe(server, users.user0.token, {
        ...testRecipe,
        title: `Multi Page ${i}`,
      });
    }

    // Get page 1
    const page1 = await request(server).get('/anonymous/recipes?page=1&pageSize=7').expect(200);

    // Get page 2
    const page2 = await request(server).get('/anonymous/recipes?page=2&pageSize=7').expect(200);

    // Get page 3
    const page3 = await request(server).get('/anonymous/recipes?page=3&pageSize=7').expect(200);

    // Ensure we got different results
    expect(page1.body.recipes).to.have.length(7);
    expect(page2.body.recipes).to.have.length(7);
    expect(page1.body.recipes[0].id).to.not.equal(page2.body.recipes[0].id);

    // Check pagination metadata is correct for pages
    expect(page1.body.pagination).to.have.property('currentPage', 1);
    expect(page1.body.pagination).to.have.property('hasPreviousPage', false);
    expect(page1.body.pagination).to.have.property('hasNextPage', true);

    expect(page2.body.pagination).to.have.property('currentPage', 2);
    expect(page2.body.pagination).to.have.property('hasPreviousPage', true);
    expect(page2.body.pagination).to.have.property('hasNextPage', true);

    expect(page3.body.pagination).to.have.property('currentPage', 3);
    expect(page3.body.pagination).to.have.property('hasPreviousPage', true);
  });

  it('should reject anonymous requests with pageSize exceeding 100', async () => {
    await request(server).get('/anonymous/recipes?page=1&pageSize=101').expect(400);
  });

  it('should not include soft-deleted recipes in search results', async () => {
    const createResponse = await request(server)
      .post('/recipes')
      .set('Cookie', [`access_token=${users.user0.token}`])
      .send({
        ...testRecipe,
        title: 'Recipe To Delete',
        description: 'This recipe will be deleted',
      })
      .expect(201);

    const recipeSlug = createResponse.body.slug;

    const beforeDeleteResponse = await request(server)
      .get('/recipes?q=Recipe To Delete')
      .set('Cookie', [`access_token=${users.user0.token}`])
      .expect(200);

    expect(beforeDeleteResponse.body.recipes).to.be.an('array');
    expect(beforeDeleteResponse.body.recipes.length).to.equal(1);
    expect(beforeDeleteResponse.body.recipes[0].title).to.equal('Recipe To Delete');

    await request(server)
      .delete(`/recipes/${recipeSlug}`)
      .set('Cookie', [`access_token=${users.user0.token}`])
      .expect(204);

    const afterDeleteResponse = await request(server)
      .get('/anonymous/recipes?q=Recipe To Delete')
      .set('Cookie', [`access_token=${users.user0.token}`])
      .expect(200);

    expect(afterDeleteResponse.body.recipes).to.be.an('array');
    expect(afterDeleteResponse.body.recipes.length).to.equal(0);
  });
});
