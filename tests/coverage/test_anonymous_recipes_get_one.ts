/**
 * Tests for anonymous recipe retrieval endpoint
 */

import type { Server } from 'node:http';
import { expect } from 'chai';
import request from 'supertest';
import app from '../../src/app.ts';
import type { RecipeEntity } from '../../src/schemas/recipe.ts';
import { nockJwks } from '../helpers/auth.ts';
import { reinitializeDatabase } from '../helpers/dbHelpers.ts';
import { createFavorite, createRecipe } from '../helpers/recipeHelper.ts';
import { createUser } from '../helpers/userHelper.ts';
import users from '../helpers/users.json' with { type: 'json' };

describe('/anonymous/recipes/:slug GET', () => {
  let server: Server;
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
    await createUser(server, users.user1.token);
    recipe = await createRecipe(server, users.user0.token);
  });

  it('should get a specific recipe by ID without authentication', async () => {
    const response = await request(server).get(`/anonymous/recipes/${recipe.slug}`).expect(200);

    expect(response.body).to.have.property('id', recipe.id);
    expect(response.body).to.have.property('title', recipe.title);
    expect(response.body).to.have.property('description', recipe.description);
    expect(response.body).to.have.property('ingredients').that.deep.equals(recipe.ingredients);
    expect(response.body).to.have.property('recipe').that.deep.equals(recipe.recipe);
    expect(response.body.authorUsername).to.be.a.string;
  });

  it('should return 400 when recipe does not exist', async () => {
    await request(server).get('/anonymous/recipes/non-existent-slug').expect(400);
  });
});
