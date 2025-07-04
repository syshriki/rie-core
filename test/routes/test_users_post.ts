/**
 * Tests for user API endpoints
 */

import type { Server } from 'node:http';
import { expect } from 'chai';
import request from 'supertest';
import app from '../../src/app.ts';
import { nockJwks } from '../helpers/auth.ts';
import { reinitializeDatabase } from '../helpers/dbHelpers.ts';
import users from '../helpers/users.json' with { type: 'json' };

describe('POST /api/users', () => {
  let server: Server;

  before(async () => {
    server = await app();
    await nockJwks();
  });

  beforeEach(async () => {
    await reinitializeDatabase();
  });

  after(async () => {
    await new Promise<void>((resolve) => {
      server.close(() => resolve());
    });
  });

  it('should create a new user', async () => {
    const { body } = await request(server)
      .post('/api/users')
      .set('Cookie', [`auth_token=${users.user0.token}`])
      .send({ username: 'testuser' })
      .expect(200);

    expect(body).to.have.property('username', 'testuser');
    expect(body).to.have.property('createdAt').that.is.a('string');
  });

  it('should return 409 Conflict if user already exists', async () => {
    await request(server)
      .post('/api/users')
      .set('Cookie', [`auth_token=${users.user0.token}`])
      .send({ username: 'testuser' })
      .expect(200);

    await request(server)
      .post('/api/users')
      .set('Cookie', [`auth_token=${users.user0.token}`])
      .send({ username: 'testuser' })
      .expect(409);
  });

  it('should validate username', async () => {
    await request(server)
      .post('/api/users')
      .set('Cookie', [`auth_token=${users.user0.token}`])
      .send({ username: '' })
      .expect(422);
  });
});
