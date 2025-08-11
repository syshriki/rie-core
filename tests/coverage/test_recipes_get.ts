/**
 * Tests for recipes listing endpoint
 */

import type { Server } from 'node:http';
import { expect } from 'chai';
import request from 'supertest';
import app from '../../src/app.ts';
import { nockJwks } from '../helpers/auth.ts';
import { reinitializeDatabase } from '../helpers/dbHelpers.ts';
import { createUser } from '../helpers/userHelper.ts';
import users from '../helpers/users.json' with { type: 'json' };

describe('/recipes GET', () => {
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
    await request(server)
      .post('/recipes')
      .set('Cookie', [`access_token=${users.user0.token}`])
      .send({
        ...testRecipe,
        title: 'Recipe 1',
        description: 'First test recipe',
      });

    await request(server)
      .post('/recipes')
      .set('Cookie', [`access_token=${users.user0.token}`])
      .send({
        ...testRecipe,
        title: 'Recipe 2',
        description: 'Second test recipe',
      });

    // Create more recipes for pagination testing
    for (let i = 3; i <= 12; i++) {
      await request(server)
        .post('/recipes')
        .set('Cookie', [`access_token=${users.user0.token}`])
        .send({
          ...testRecipe,
          title: `Recipe ${i}`,
          description: `Test recipe number ${i}`,
        });
    }

    // Create a recipe with mixed case for case insensitivity testing
    await request(server)
      .post('/recipes')
      .set('Cookie', [`access_token=${users.user0.token}`])
      .send({
        ...testRecipe,
        title: 'MiXeD CaSe Recipe',
        description: 'A recipe with MiXeD case title and description',
      });

    // Favorite a recipe for favorite status testing
    const getResponse = await request(server)
      .get('/recipes')
      .query({ page: 1, pageSize: 10 })
      .set('Cookie', [`access_token=${users.user0.token}`]);

    const recipeSlug = getResponse.body.recipes[0].slug;
    await request(server)
      .post(`/recipes/${recipeSlug}/favorite`)
      .set('Cookie', [`access_token=${users.user0.token}`]);
  });

  it('should 200 when request all recipes page', async () => {
    const response = await request(server)
      .get('/recipes')
      .set('Cookie', [`access_token=${users.user0.token}`])
      .expect(200);

    expect(response.body).to.have.property('recipes').that.is.an('array');
    expect(response.body.recipes.length).to.be.greaterThan(0);
    expect(response.body).to.have.property('hasMore');
    expect(response.body.recipes[0]).to.have.property('title'); // Most recent first
  });

  it('should 200 when filtering recipes by title search term', async () => {
    const response = await request(server)
      .get('/recipes?q=Recipe 12')
      .set('Cookie', [`access_token=${users.user0.token}`])
      .expect(200);

    expect(response.body).to.have.property('recipes').that.is.an('array');
    expect(response.body.recipes).to.have.length(1);
    expect(response.body.recipes[0]).to.have.property('title', 'Recipe 12');
  });

  it('should 200 when filtering recipes by description search term', async () => {
    const response = await request(server)
      .get('/recipes?q=First test')
      .set('Cookie', [`access_token=${users.user0.token}`])
      .expect(200);

    expect(response.body).to.have.property('recipes').that.is.an('array');
    expect(response.body.recipes).to.have.length(1);
    expect(response.body.recipes[0]).to.have.property('title', 'Recipe 1');
    expect(response.body.recipes[0].description).to.include('First test');
  });

  it('should handle case-insensitive search', async () => {
    const response = await request(server)
      .get('/recipes?q=mixed case')
      .set('Cookie', [`access_token=${users.user0.token}`])
      .expect(200);

    expect(response.body).to.have.property('recipes').that.is.an('array');
    expect(response.body.recipes).to.have.length(1);
    expect(response.body.recipes[0].title).to.equal('MiXeD CaSe Recipe');
  });

  it('should use default pagination limit correctly', async () => {
    const response = await request(server)
      .get('/recipes')
      .set('Cookie', [`access_token=${users.user0.token}`])
      .expect(200);

    expect(response.body).to.have.property('recipes').that.is.an('array');
    expect(response.body.recipes.length).to.equal(10); // Assuming default limit is 10
    expect(response.body).to.have.property('hasMore', true);
    expect(response.body).to.have.property('nextCursor').that.is.a('string');
  });

  it('should honor custom pageSize parameter', async () => {
    const response = await request(server)
      .get('/recipes?pageSize=5')
      .set('Cookie', [`access_token=${users.user0.token}`])
      .expect(200);

    expect(response.body).to.have.property('recipes').that.is.an('array');
    expect(response.body.recipes).to.have.length(5);
    expect(response.body).to.have.property('hasMore', true);
  });

  it('should return correct next page with cursor-based pagination', async () => {
    // Get first page
    const firstPage = await request(server)
      .get('/recipes?pageSize=5')
      .set('Cookie', [`access_token=${users.user0.token}`])
      .expect(200);

    expect(firstPage.body.recipes).to.have.length(5);
    expect(firstPage.body).to.have.property('nextCursor').that.is.a('string');

    // Get second page using the cursor
    const secondPage = await request(server)
      .get(`/recipes?pageSize=5&cursor=${firstPage.body.nextCursor}`)
      .set('Cookie', [`access_token=${users.user0.token}`])
      .expect(200);

    expect(secondPage.body.recipes).to.have.length(5);
    expect(secondPage.body.recipes[0].id).to.not.equal(firstPage.body.recipes[0].id);
    expect(secondPage.body.recipes[0].title).to.not.equal(firstPage.body.recipes[0].title);
  });

  it('should set hasMore=false on the last page', async () => {
    // We have 13 total recipes, getting all with a limit higher than that
    const response = await request(server)
      .get('/recipes?pageSize=15')
      .set('Cookie', [`access_token=${users.user0.token}`])
      .expect(200);

    expect(response.body).to.have.property('recipes');
    expect(response.body).to.have.property('hasMore', false);
    expect(response.body).to.have.property('nextCursor', null);
  });

  it('should set nextCursor=null when no more results', async () => {
    // First, get all recipes to find out total count
    const allRecipes = await request(server)
      .get('/recipes?pageSize=15') // Limit higher than total count
      .set('Cookie', [`access_token=${users.user0.token}`])
      .expect(200);

    const totalCount = allRecipes.body.recipes.length;

    // Now get with exact limit
    const response = await request(server)
      .get(`/recipes?pageSize=${totalCount}`)
      .set('Cookie', [`access_token=${users.user0.token}`])
      .expect(200);

    expect(response.body).to.have.property('recipes').that.is.an('array');
    expect(response.body.recipes).to.have.length(totalCount);
    expect(response.body).to.have.property('hasMore', false);
    expect(response.body).to.have.property('nextCursor', null);
  });

  it('should support page-based pagination', async () => {
    const response = await request(server)
      .get('/recipes?page=1&pageSize=5')
      .set('Cookie', [`access_token=${users.user0.token}`])
      .expect(200);

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

  it('should navigate through pages with page-based pagination', async () => {
    // Get page 1
    const page1 = await request(server)
      .get('/recipes?page=1&pageSize=5')
      .set('Cookie', [`access_token=${users.user0.token}`])
      .expect(200);

    // Get page 2
    const page2 = await request(server)
      .get('/recipes?page=2&pageSize=5')
      .set('Cookie', [`access_token=${users.user0.token}`])
      .expect(200);

    // Ensure we got different results
    expect(page1.body.recipes).to.have.length(5);
    expect(page2.body.recipes).to.have.length(5);
    expect(page1.body.recipes[0].id).to.not.equal(page2.body.recipes[0].id);

    // Check pagination metadata is correct for page 2
    expect(page2.body.pagination).to.have.property('currentPage', 2);
    expect(page2.body.pagination).to.have.property('hasPreviousPage', true);
  });

  it('should include correct is_favorite status for favorited recipes', async () => {
    const response = await request(server)
      .get('/recipes')
      .set('Cookie', [`access_token=${users.user0.token}`])
      .expect(200);

    const hasFavorite = response.body.recipes.some((recipe: any) => recipe.isFavorite === true);
    expect(hasFavorite).to.be.true;
  });

  it('should show is_favorite=false for unfavorited recipes', async () => {
    const response = await request(server)
      .get('/recipes')
      .set('Cookie', [`access_token=${users.user1.token}`])
      .expect(200);

    const allUnfavorited = response.body.recipes.every(
      (recipe: any) => recipe.isFavorite === false,
    );
    expect(allUnfavorited).to.be.true;
  });

  it('should reject requests with pageSize exceeding 100', async () => {
    await request(server)
      .get('/recipes?page=1&pageSize=101')
      .set('Cookie', [`access_token=${users.user0.token}`])
      .expect(400);
  });

  it('should not include soft-deleted recipes in search results', async () => {
    // Create a recipe with specific title for testing
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

    // Verify it appears in search results
    const beforeDeleteResponse = await request(server)
      .get('/recipes?q=Recipe To Delete')
      .set('Cookie', [`access_token=${users.user0.token}`])
      .expect(200);

    expect(beforeDeleteResponse.body.recipes).to.be.an('array');
    expect(beforeDeleteResponse.body.recipes.length).to.equal(1);
    expect(beforeDeleteResponse.body.recipes[0].title).to.equal('Recipe To Delete');

    // Delete the recipe
    await request(server)
      .delete(`/recipes/${recipeSlug}`)
      .set('Cookie', [`access_token=${users.user0.token}`])
      .expect(204);

    // Verify it no longer appears in search results
    const afterDeleteResponse = await request(server)
      .get('/recipes?q=Recipe To Delete')
      .set('Cookie', [`access_token=${users.user0.token}`])
      .expect(200);

    expect(afterDeleteResponse.body.recipes).to.be.an('array');
    expect(afterDeleteResponse.body.recipes.length).to.equal(0);
  });
});
