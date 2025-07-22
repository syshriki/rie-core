import type { Server } from 'node:http';
import { expect } from 'chai';
import request from 'supertest';
import app from '../../src/app.ts';
import type { UserEntity } from '../../src/schemas/user.ts';
import { nockJwks } from '../helpers/auth.ts';
import { reinitializeDatabase } from '../helpers/dbHelpers.ts';
import { createUser } from '../helpers/userHelper.ts';
import users from '../helpers/users.json' with { type: 'json' };

describe('GET /users/:id', () => {
  let server: Server;
  let user0: UserEntity;
  let user1: UserEntity;

  before(async () => {
    server = await app();
    await nockJwks();
  });

  beforeEach(async () => {
    await reinitializeDatabase();
    user0 = await createUser(server, users.user0.token);
    user1 = await createUser(server, users.user1.token);
  });

  after(async () => {
    await new Promise<void>((resolve) => {
      server.close(() => resolve());
    });
  });

  it('should 200 getting user by id', async () => {
    const response = await request(server)
      .get(`/users/${user1.id}`)
      .set('Cookie', [`access_token=${users.user0.token}`])
      .expect(200);

    expect(response.body).to.have.property('id', user1.id);
    expect(response.body).to.have.property('createdAt').that.is.a('string');
  });

  it('should 400 when specifying non-existent user', async () => {
    const { body } = await request(server)
      .get('/users/2')
      .set('Cookie', [`access_token=${users.user0.token}`])
      .expect(400);
    expect(body).to.have.property('code', 'USER_NOT_FOUND');
  });

  it('should require authentication', async () => {
    await request(server).get('/users/1').expect(401);
  });
});
