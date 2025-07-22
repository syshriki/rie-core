import type { Server } from 'node:http';
import request from 'supertest';
import type { CreateRecipeBody } from '../../src/controllers/recipes/create/schema.ts';

export async function createRecipe(server: Server, token: string, recipe?: CreateRecipeBody) {
  const { body } = await request(server)
    .post('/recipes')
    .set('Cookie', [`access_token=${token}`])
    .send(
      recipe ?? {
        title: 'Test Recipe',
        description: 'A test recipe description',
        recipe: 'step1 step2',
        ingredients: 'ingredient1, ingredient2',
      },
    )
    .expect(201);

  return body;
}
