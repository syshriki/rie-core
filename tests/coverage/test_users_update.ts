import type { Server } from 'node:http';
import { expect } from 'chai';
import request from 'supertest';
import app from '../../src/app.ts';
import type { Output as UserOutput } from '../../src/controllers/users/create/types.ts';
import { nockJwks } from '../helpers/auth.ts';
import { reinitializeDatabase } from '../helpers/dbHelpers.ts';
import { createUser } from '../helpers/userHelper.ts';
import users from '../helpers/users.json' with { type: 'json' };

describe('/users/me PATCH', () => {
  let server: Server;
  let user0: UserOutput;
  let user1: UserOutput;

  before(async () => {
    server = await app();
    nockJwks();
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

  it('should 200 when username successfully updated', async () => {
    const newUsername = 'MyNewUsername';

    const response = await request(server)
      .patch('/users/me')
      .set('Cookie', [`access_token=${users.user0.token}`])
      .send({ username: newUsername })
      .expect(200);

    expect(response.body).to.have.property('id', user0.id);
    expect(response.body).to.have.property('username', newUsername);
    expect(response.body).to.have.property('createdAt').that.is.a('string');
  });

  it('should 409 when username is already taken', async () => {
    const { body } = await request(server)
      .patch('/users/me')
      .set('Cookie', [`access_token=${users.user0.token}`])
      .send({ username: user1.username })
      .expect(409);

    expect(body).to.have.property('code', 'USERNAME_TAKEN');
  });

  it('should 400 on missing username in body', async () => {
    const { body } = await request(server)
      .patch('/users/me')
      .set('Cookie', [`access_token=${users.user0.token}`])
      .send({})
      .expect(400);

    expect(body).to.have.property('code');
  });

  it('should 400 on invalid username characters', async () => {
    const { body } = await request(server)
      .patch('/users/me')
      .set('Cookie', [`access_token=${users.user0.token}`])
      .send({ username: 'bad@name!' })
      .expect(400);

    expect(body).to.have.property('code');
  });

  it('should require authentication', async () => {
    await request(server)
      .patch('/users/me')
      .send({ username: 'NoAuth' })
      .expect(401);
  });
});
