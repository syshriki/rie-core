import type { Server } from 'node:http';
import { expect } from 'chai';
import request from 'supertest';
import app from '../../src/app.ts';
import type { RecipeEntity } from '../../src/schemas/recipe.ts';
import { nockJwks } from '../helpers/auth.ts';
import { reinitializeDatabase } from '../helpers/dbHelpers.ts';
import { createRecipe } from '../helpers/recipeHelper.ts';
import { createUser } from '../helpers/userHelper.ts';
import users from '../helpers/users.json' with { type: 'json' };

describe('GET /users/:username/favorites', () => {
  let server: Server;
  const testUsername = 'testuser';
  let recipe: RecipeEntity;

  before(async () => {
    server = await app();
    nockJwks();
  });

  after(async () => {
    await new Promise<void>((resolve) => {
      server.close(() => resolve());
    });
  });

  beforeEach(async () => {
    await reinitializeDatabase();

    await createUser(server, users.user0.token);
    recipe = await createRecipe(server, users.user0.token);
  });

  it('should return user favorites', async () => {
    await request(server)
      .post(`/recipes/${recipe.slug}/favorite`)
      .set('Cookie', [`access_token=${users.user0.token}`])
      .expect(201);

    // Get favorites
    const response = await request(server)
      .get(`/users/${testUsername}/favorites`)
      .set('Cookie', [`access_token=${users.user0.token}`])
      .expect(200);

    expect(response.body).to.have.property('recipes');
    expect(response.body.recipes).to.be.an('array').with.lengthOf(1);
    expect(response.body.recipes[0]).to.have.property('id', recipe.id);
  });
});
