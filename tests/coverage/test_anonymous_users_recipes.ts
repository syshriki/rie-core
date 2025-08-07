import type { Server } from 'node:http';
import { expect } from 'chai';
import request from 'supertest';
import app from '../../src/app.ts';
import { nockJwks } from '../helpers/auth.ts';
import { reinitializeDatabase } from '../helpers/dbHelpers.ts';
import { createRecipe } from '../helpers/recipeHelper.ts';
import { createUser } from '../helpers/userHelper.ts';
import users from '../helpers/users.json' with { type: 'json' };

describe('/anonymous/users/:authorId/recipes GET', () => {
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

  it("should 200 when retrieving author's recipes anonymously", async () => {
    await createRecipe(server, users.user0.token, testRecipe1);
    await createRecipe(server, users.user0.token, testRecipe2);
    await createRecipe(server, users.user1.token, testRecipe3);

    const response = await request(server).get('/anonymous/users/0/recipes').expect(200);

    expect(response.body).to.have.property('recipes').that.is.an('array');
    expect(response.body.recipes).to.have.length(2);
    expect(response.body).to.have.property('hasMore', false);

    // Verify recipe contents
    const titles = response.body.recipes.map((r: { title: string }) => r.title);
    expect(titles).to.include(testRecipe1.title);
    expect(titles).to.include(testRecipe2.title);
  });

  it('should 200 when paginating anonymous results', async () => {
    for (let i = 0; i < 12; i++) {
      await createRecipe(server, users.user0.token, {
        title: `Pagination test ${i}`,
        recipe: 'pagination steps',
      });
    }

    const response = await request(server).get('/anonymous/users/0/recipes?pageSize=5').expect(200);

    expect(response.body.recipes).to.have.length(5);
    expect(response.body).to.have.property('hasMore', true);
    expect(response.body).to.have.property('nextCursor').that.is.a('string');

    const nextPage = await request(server)
      .get(`/anonymous/users/0/recipes?pageSize=5&cursor=${response.body.nextCursor}`)
      .expect(200);

    expect(nextPage.body.recipes).to.have.length(5);
    expect(nextPage.body.recipes).to.not.deep.equal(response.body.recipes);
  });

  it('should 200 when user has no recipes (anonymous)', async () => {
    // Create a new user with no recipes
    await createUser(server, users.user2.token);

    const response = await request(server).get('/anonymous/users/2/recipes').expect(200);

    expect(response.body).to.have.property('recipes').that.is.an('array');
    expect(response.body.recipes).to.have.length(0);
    expect(response.body).to.have.property('hasMore', false);
    expect(response.body).to.have.property('nextCursor', null);
  });
});
