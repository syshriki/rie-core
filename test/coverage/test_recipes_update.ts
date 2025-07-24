/**
 * Tests for recipe update endpoint - Direct Import Pattern
 */

import type { Server } from 'node:http';
import { expect } from 'chai';
import request from 'supertest';
import app from '../../src/app.ts';
import type { RecipeEntity } from '../../src/schemas/recipe.ts';
import type { UserEntity } from '../../src/schemas/user.ts';
import { nockJwks } from '../helpers/auth.ts';
import { reinitializeDatabase } from '../helpers/dbHelpers.ts';
import { createFavorite, createRecipe } from '../helpers/recipeHelper.ts';
import { createUser } from '../helpers/userHelper.ts';
import users from '../helpers/users.json' with { type: 'json' };

describe('PUT /recipes/:slug', () => {
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
    await createFavorite(server, users.user0.token, recipe.slug);
  });

  it('should 200 when recipe successfully updated', async () => {
    const updatedRecipe = {
      title: 'Updated Recipe Title',
      description: 'Updated description',
      ingredients: `'Updated Ingredient 1', 'Updated Ingredient 2', 'New Ingredient'`,
      recipe: `'Updated Step 1', 'Updated Step 2', 'New Step'`,
    };

    const response = await request(server)
      .put(`/recipes/${recipe.slug}`)
      .set('Cookie', [`access_token=${users.user0.token}`])
      .send(updatedRecipe)
      .expect(200);

    expect(response.body).to.have.property('id', recipe.id + 1);
    expect(response.body).to.have.property('title', updatedRecipe.title);
    expect(response.body).to.have.property('description', updatedRecipe.description);
    expect(response.body).to.have.property('slug', recipe.slug);
    expect(response.body)
      .to.have.property('ingredients')
      .that.deep.equals(updatedRecipe.ingredients);
    expect(response.body).to.have.property('recipe').that.deep.equals(updatedRecipe.recipe);
    expect(response.body).to.have.property('authorId', user.id);
  });

  it('should 400 for non-existent recipe', async () => {
    const nonExistentId = 9999;

    const { body } = await request(server)
      .put(`/recipes/${nonExistentId}`)
      .set('Cookie', [`access_token=${users.user0.token}`])
      .send({
        title: 'Updated Recipe',
        ingredients: 'Ingredient',
        recipe: 'Instruction',
      })
      .expect(400);

    expect(body).to.have.property('code', 'RECIPE_NOT_FOUND');
  });

  it('should 400 on missing required field', async () => {
    const { body } = await request(server)
      .put(`/recipes/${recipe.slug}`)
      .set('Cookie', [`access_token=${users.user0.token}`])
      .send({
        title: 'Updated Recipe',
        ingredients: 'Ingredient',
      })
      .expect(400);

    expect(body).to.have.property('code', 'MISSING_KEY');
  });

  it('should 403 when updating recipes created by others', async () => {
    await createUser(server, users.user1.token);

    const { body } = await request(server)
      .put(`/recipes/${recipe.slug}`)
      .set('Cookie', [`access_token=${users.user1.token}`])
      .send({
        title: 'Hijacked Recipe',
        ingredients: 'Bad Ingredient',
        recipe: 'Bad Instruction',
      })
      .expect(403);

    expect(body).to.have.property('code', 'UNAUTHORIZED_UPDATE');
  });
});
