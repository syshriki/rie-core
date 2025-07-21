import type { Server } from 'node:http';
import request from 'supertest';
import type { RecipeCreateInput } from '../../src/schemas/recipe.ts';

export async function createRecipe(server: Server, token: string, recipe: RecipeCreateInput) {
  // Create a test recipe
  const { body } = await request(server)
    .post('/recipes')
    .set('Authorization', `Bearer ${token}`)
    .send(recipe)
    .expect(200);

  return body;
}
