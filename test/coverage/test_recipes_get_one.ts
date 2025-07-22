/**
 * Tests for recipe retrieval endpoint - Direct Import Pattern
 */

import type { Server } from 'node:http';
import { expect } from 'chai';
import request from 'supertest';
import app from '../../src/app.ts';
import type { RecipeEntity } from '../../src/schemas/recipe.ts';
import type { UserEntity } from '../../src/schemas/user.ts';
import { nockJwks } from '../helpers/auth.ts';
import { reinitializeDatabase } from '../helpers/dbHelpers.ts';
import { createRecipe } from '../helpers/recipeHelper.ts';
import { createUser } from '../helpers/userHelper.ts';
import users from '../helpers/users.json' with { type: 'json' };

describe('GET /recipes/:id', () => {
  let server: Server;
  let recipe: RecipeEntity;
  let user: UserEntity;

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

    user = await createUser(server, users.user0.token);
    recipe = await createRecipe(server, users.user0.token);
  });

  it('should get a specific recipe by ID', async () => {
    const response = await request(server)
      .get(`/recipes/${recipe.slug}`)
      .set('Cookie', [`access_token=${users.user0.token}`])
      .expect(200);

    expect(response.body).to.have.property('id', recipe.id);
    expect(response.body).to.have.property('title', recipe.title);
    expect(response.body).to.have.property('description', recipe.description);
    expect(response.body).to.have.property('ingredients').that.deep.equals(recipe.ingredients);
    expect(response.body).to.have.property('recipe').that.deep.equals(recipe.recipe);
    expect(response.body).to.have.property('authorId', user.id);
  });

  it('should 400 for non-existent recipe', async () => {
    const nonExistentId = 9999;

    const { body } = await request(server)
      .get(`/recipes/${nonExistentId}`)
      .set('Cookie', [`access_token=${users.user0.token}`])
      .expect(400);

    expect(body.code).to.equal('RECIPE_NOT_FOUND');
  });

  it('should include favorite status for the authenticated user', async () => {
    // First add recipe to favorites
    await request(server)
      .post(`/recipes/${recipe.slug}/favorite`)
      .set('Cookie', [`access_token=${users.user0.token}`])
      .expect(200);

    // Then check that the recipe includes favorite status
    const response = await request(server)
      .get(`/recipes/${recipe.slug}`)
      .set('Cookie', [`access_token=${users.user0.token}`])
      .expect(200);

    expect(response.body).to.have.property('isFavorite', true);
  });
});
