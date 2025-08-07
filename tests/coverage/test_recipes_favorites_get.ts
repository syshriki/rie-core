import type { Server } from 'node:http';
import { expect } from 'chai';
import request from 'supertest';
import app from '../../src/app.ts';
import type { RecipeEntity } from '../../src/schemas/recipe.ts';
interface RecipeWithFavorite extends RecipeEntity {
  isFavorite: boolean;
}
import type { UserEntity } from '../../src/schemas/user.ts';
import { nockJwks } from '../helpers/auth.ts';
import { reinitializeDatabase } from '../helpers/dbHelpers.ts';
import { createFavorite, createRecipe } from '../helpers/recipeHelper.ts';
import { createUser } from '../helpers/userHelper.ts';
import users from '../helpers/users.json' with { type: 'json' };

describe('GET /users/:id/favorites', () => {
  let server: Server;
  let user: UserEntity;
  let secondUser: UserEntity;
  let recipe: RecipeEntity;
  let secondRecipe: RecipeEntity;

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
    secondUser = await createUser(server, users.user1.token);
    recipe = await createRecipe(server, users.user0.token);
    secondRecipe = await createRecipe(server, users.user1.token);
  });

  it("should 200 when viewing another user's favorites with correct isFavorite flags", async () => {
    // User0 favorites recipe1 and recipe2
    await createFavorite(server, users.user0.token, recipe.slug);
    await createFavorite(server, users.user0.token, secondRecipe.slug);

    // User1 only favorites recipe1
    await createFavorite(server, users.user1.token, recipe.slug);

    // User1 views User0's favorites
    const response = await request(server)
      .get(`/users/${user.id}/favorites`)
      .set('Cookie', [`access_token=${users.user1.token}`])
      .expect(200);

    expect(response.body).to.have.property('recipes');
    expect(response.body.recipes).to.be.an('array').with.lengthOf(2);

    // Find recipe1 in the response
    const recipe1Response = response.body.recipes.find(
      (r: RecipeWithFavorite) => r.id === recipe.id,
    );
    // Find recipe2 in the response
    const recipe2Response = response.body.recipes.find(
      (r: RecipeWithFavorite) => r.id === secondRecipe.id,
    );

    // User1 has favorited recipe1, so isFavorite should be true
    expect(recipe1Response).to.have.property('isFavorite', true);
    // User1 has not favorited recipe2, so isFavorite should be false
    expect(recipe2Response).to.have.property('isFavorite', false);
  });

  it('should 200 when viewing own favorites with all isFavorite flags set to true', async () => {
    // User0 favorites both recipes
    await createFavorite(server, users.user0.token, recipe.slug);
    await createFavorite(server, users.user0.token, secondRecipe.slug);

    // User0 views their own favorites
    const response = await request(server)
      .get(`/users/${user.id}/favorites`)
      .set('Cookie', [`access_token=${users.user0.token}`])
      .expect(200);

    expect(response.body).to.have.property('recipes');
    expect(response.body.recipes).to.be.an('array').with.lengthOf(2);

    // All recipes should have isFavorite set to true since user is viewing their own favorites
    for (const recipe of response.body.recipes as RecipeWithFavorite[]) {
      expect(recipe).to.have.property('isFavorite', true);
    }
  });

  it('should 401 when request is unauthenticated', async () => {
    // Try to access favorites without authentication
    await request(server).get(`/users/${user.id}/favorites`).expect(401);
  });

  it('should 200 when requesting paginated results with pageSize parameter', async () => {
    // Create multiple recipes for pagination testing
    const recipes = [];
    for (let i = 0; i < 5; i++) {
      const newRecipe = await createRecipe(server, users.user0.token);
      recipes.push(newRecipe);
      await createFavorite(server, users.user0.token, newRecipe.slug);
    }

    // Get favorites with a pageSize of 2
    const response = await request(server)
      .get(`/users/${user.id}/favorites`)
      .query({ pageSize: 2 })
      .set('Cookie', [`access_token=${users.user0.token}`])
      .expect(200);

    expect(response.body).to.have.property('recipes');
    expect(response.body.recipes).to.be.an('array').with.lengthOf(2);
    expect(response.body).to.have.property('hasMore', true);
    expect(response.body).to.have.property('nextCursor');

    // Use the nextCursor to get the next page
    const nextCursor = response.body.nextCursor;
    const secondPageResponse = await request(server)
      .get(`/users/${user.id}/favorites`)
      .query({ pageSize: 2, cursor: nextCursor })
      .set('Cookie', [`access_token=${users.user0.token}`])
      .expect(200);

    expect(secondPageResponse.body).to.have.property('recipes');
    expect(secondPageResponse.body.recipes).to.be.an('array').with.lengthOf(2);
    expect(secondPageResponse.body.recipes[0].id).to.not.equal(response.body.recipes[0].id);
    expect(secondPageResponse.body.recipes[1].id).to.not.equal(response.body.recipes[1].id);
  });
});
