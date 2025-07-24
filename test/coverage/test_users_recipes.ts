import type { Server } from 'node:http';
import { expect } from 'chai';
import request from 'supertest';
import app from '../../src/app.ts';
import { nockJwks } from '../helpers/auth.ts';
import { reinitializeDatabase } from '../helpers/dbHelpers.ts';
import { createFavorite, createRecipe } from '../helpers/recipeHelper.ts';
import { createUser } from '../helpers/userHelper.ts';
import users from '../helpers/users.json' with { type: 'json' };

describe('/users/:id/recipes GET', () => {
  let server: Server;

  const testRecipe1 = {
    title: 'User Recipe 1',
    description: 'A test recipe from user',
    recipe: 'step1 step2',
    ingredients: 'ingredient1, ingredient2',
  };

  const testRecipe2 = {
    title: 'User Recipe 2',
    description: 'Another test recipe from user',
    recipe: 'step1 step2 step3',
    ingredients: 'ingredient1, ingredient2, ingredient3',
  };
  const testRecipe3 = {
    title: 'User Recipe 3',
    description: 'Another test recipe from user1',
    recipe: 'step1 step2 step3',
    ingredients: 'ingredient1, ingredient2, ingredient3',
  };

  before(async () => {
    server = await app();
    await nockJwks();
  });

  after(async () => {
    await new Promise<void>((resolve) => {
      server.close(() => resolve());
    });
  });

  beforeEach(async () => {
    await reinitializeDatabase();
    await createUser(server, users.user0.token);
    await createUser(server, users.user1.token);
  });

  it("should 200 when retrieving author's recipes", async () => {
    await createRecipe(server, users.user0.token, testRecipe1);
    await createRecipe(server, users.user0.token, testRecipe2);
    await createRecipe(server, users.user1.token, testRecipe3);

    const response = await request(server)
      .get('/users/0/recipes')
      .set('Cookie', [`access_token=${users.user0.token}`])
      .expect(200);

    expect(response.body).to.have.property('recipes').that.is.an('array');
    expect(response.body.recipes).to.have.length(2);
    expect(response.body).to.have.property('hasMore', false);

    // Verify recipe contents
    const titles = response.body.recipes.map((r: { title: string }) => r.title);
    expect(titles).to.include(testRecipe1.title);
    expect(titles).to.include(testRecipe2.title);
  });

  it('should 200 when paginating results', async () => {
    for (let i = 0; i < 12; i++) {
      await createRecipe(server, users.user0.token, {
        title: `Pagination test ${i}`,
        recipe: 'pagination steps',
      });
    }

    const response = await request(server)
      .get('/users/0/recipes?limit=5')
      .set('Cookie', [`access_token=${users.user0.token}`])
      .expect(200);

    expect(response.body.recipes).to.have.length(5);
    expect(response.body).to.have.property('hasMore', true);
    expect(response.body).to.have.property('nextCursor').that.is.a('string');

    const nextPage = await request(server)
      .get(`/users/0/recipes?limit=5&cursor=${response.body.nextCursor}`)
      .set('Cookie', [`access_token=${users.user0.token}`])
      .expect(200);

    expect(nextPage.body.recipes).to.have.length(5);
    expect(nextPage.body.recipes).to.not.deep.equal(response.body.recipes);
  });

  it('should 200 when user has no recipes', async () => {
    // Create a new user with no recipes
    await createUser(server, users.user2.token);

    const response = await request(server)
      .get('/users/2/recipes')
      .set('Cookie', [`access_token=${users.user0.token}`])
      .expect(200);

    expect(response.body).to.have.property('recipes').that.is.an('array');
    expect(response.body.recipes).to.have.length(0);
    expect(response.body).to.have.property('hasMore', false);
    expect(response.body).to.have.property('nextCursor', null);
  });

  it('should return 401 when missing access_token', async () => {
    await request(server).get('/users/0/recipes').expect(401);
  });

  it('should 200 when authenticated as a different user', async () => {
    await createRecipe(server, users.user0.token, testRecipe1);
    await createRecipe(server, users.user0.token, testRecipe2);
    await createRecipe(server, users.user1.token, testRecipe3);

    const response = await request(server)
      .get('/users/0/recipes')
      .set('Cookie', [`access_token=${users.user1.token}`])
      .expect(200);

    expect(response.body.recipes).to.have.length(2);
  });

  it('should 200 with correct favorite status in recipes', async () => {
    const recipe1 = await createRecipe(server, users.user0.token, testRecipe1);
    const recipe2 = await createRecipe(server, users.user0.token, testRecipe2);
    const recipe3 = await createRecipe(server, users.user1.token, testRecipe3);

    const recipeSlug = recipe1.slug;

    await createFavorite(server, users.user1.token, recipeSlug);

    const response = await request(server)
      .get('/users/0/recipes')
      .set('Cookie', [`access_token=${users.user1.token}`])
      .expect(200);

    // Check if favorite status is included and at least one is favorited
    expect(response.body.recipes[0]).to.have.property('isFavorite');
    const hasFavorite = response.body.recipes.some(
      (r: { isFavorite?: boolean }) => r.isFavorite === true,
    );
    expect(hasFavorite).to.be.true;
  });
});
