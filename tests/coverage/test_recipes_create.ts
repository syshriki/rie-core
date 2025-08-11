import type { Server } from 'node:http';
import { expect } from 'chai';
import request from 'supertest';
import app from '../../src/app.ts';
import type { UserEntity } from '../../src/schemas/user.ts';
import { nockJwks } from '../helpers/auth.ts';
import { reinitializeDatabase } from '../helpers/dbHelpers.ts';
import { createUser } from '../helpers/userHelper.ts';
import users from '../helpers/users.json' with { type: 'json' };

describe('/recipes POST', () => {
  let server: Server;
  let user: UserEntity;
  const testRecipe = {
    title: 'Test Recipe',
    description: 'A test recipe description',
    recipe: 'step1 step2',
    ingredients: 'ingredient1, ingredient2',
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
    user = await createUser(server, users.user0.token);
  });

  it('should 200 with all optional fields', async () => {
    const response = await request(server)
      .post('/recipes')
      .set('Cookie', [`access_token=${users.user0.token}`])
      .send(testRecipe)
      .expect(201);

    expect(response.body).to.have.property('id').that.is.a('number');
    expect(response.body).to.have.property('title', testRecipe.title);
    expect(response.body).to.have.property('description', testRecipe.description);
    expect(response.body).to.have.property('recipe').that.deep.equals(testRecipe.recipe);
    expect(response.body).to.have.property('authorId', user.id);
    expect(response.body).to.have.property('createdAt').that.is.a('string');
    expect(response.body).to.have.property('slug', 'r1');
    expect(response.body).to.have.property('ingredients').that.deep.equals(testRecipe.ingredients);
  });

  it('should 200 with only required fields', async () => {
    const response = await request(server)
      .post('/recipes')
      .set('Cookie', [`access_token=${users.user0.token}`])
      .send({
        title: testRecipe.title,
        recipe: testRecipe.recipe,
      })
      .expect(201);

    expect(response.body).to.have.property('id').that.is.a('number');
    expect(response.body).to.have.property('title', testRecipe.title);
    expect(response.body).to.have.property('recipe').that.deep.equals(testRecipe.recipe);
    expect(response.body).to.have.property('authorId', user.id);
    expect(response.body).to.have.property('createdAt').that.is.a('string');
    expect(response.body).to.have.property('slug', 'r1');
  });

  it('should 201 when title has minimum length (1 character)', async () => {
    const minTitleRecipe = { ...testRecipe, title: 'A' };
    const response = await request(server)
      .post('/recipes')
      .set('Cookie', [`access_token=${users.user0.token}`])
      .send(minTitleRecipe)
      .expect(201);

    expect(response.body).to.have.property('title', 'A');
    expect(response.body).to.have.property('slug', 'r1');
  });

  it('should 201 when title has maximum length (99 characters)', async () => {
    const maxTitle = 'A'.repeat(99);
    const maxTitleRecipe = { ...testRecipe, title: maxTitle };
    const response = await request(server)
      .post('/recipes')
      .set('Cookie', [`access_token=${users.user0.token}`])
      .send(maxTitleRecipe)
      .expect(201);

    expect(response.body).to.have.property('title', maxTitle);
    expect(response.body).to.have.property('slug', 'r1');
  });

  it('should 201 when title contains special characters', async () => {
    const specialTitleRecipe = { ...testRecipe, title: "Pasta & Meatballs: A Chef's Recipe!" };
    const response = await request(server)
      .post('/recipes')
      .set('Cookie', [`access_token=${users.user0.token}`])
      .send(specialTitleRecipe)
      .expect(201);

    expect(response.body).to.have.property('title', specialTitleRecipe.title);
    expect(response.body).to.have.property('slug', 'r1');
  });

  it('should 201 when title has spaces and mixed capitalization', async () => {
    const spacedTitleRecipe = { ...testRecipe, title: 'SPICY Chicken   Curry  With Rice' };
    const response = await request(server)
      .post('/recipes')
      .set('Cookie', [`access_token=${users.user0.token}`])
      .send(spacedTitleRecipe)
      .expect(201);

    expect(response.body).to.have.property('title', spacedTitleRecipe.title);
    expect(response.body).to.have.property('slug', 'r1');
  });

  it('should 400 when title exceeds maximum length', async () => {
    const tooLongTitle = 'A'.repeat(101);
    const invalidRecipe = { ...testRecipe, title: tooLongTitle };

    const response = await request(server)
      .post('/recipes')
      .set('Cookie', [`access_token=${users.user0.token}`])
      .send(invalidRecipe)
      .expect(400);

    expect(response.body).to.have.property('code', 'INPUT_TOO_BIG');
  });

  it('should 400 when title is empty', async () => {
    const emptyTitleRecipe = { ...testRecipe, title: '' };

    const response = await request(server)
      .post('/recipes')
      .set('Cookie', [`access_token=${users.user0.token}`])
      .send(emptyTitleRecipe)
      .expect(400);

    expect(response.body).to.have.property('code', 'INPUT_TOO_SMALL');
  });

  it('should 400 when title contains forbidden special characters', async () => {
    const forbiddenCharRecipe = { ...testRecipe, title: 'Recipe with \0 forbidden character' };

    const response = await request(server)
      .post('/recipes')
      .set('Cookie', [`access_token=${users.user0.token}`])
      .send(forbiddenCharRecipe)
      .expect(400);

    expect(response.body).to.have.property('code', 'SPECIAL_CHARS');
  });

  it('should 401 when missing access_token header', async () => {
    await request(server).post('/recipes').send(testRecipe).expect(401);
  });
});
