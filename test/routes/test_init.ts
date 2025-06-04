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

describe('POST /api/init', () => {
  let server: Server;

  // Setup server before all tests in this file
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
    const response = await request(server)
      .post('/api/init')
      .set('Cookie', [`auth_token=${users.user0.token}`])
      .expect(200);

    expect(response.body).to.have.property('username', 'admin');
    expect(response.body).to.have.property('createdAt');
    expect(response.body.createdAt).to.be.a('string');
  });

  it('should not allow re-calling of init', async () => {
    await request(server)
      .post('/api/init')
      .set('Cookie', [`auth_token=${users.user0.token}`])
      .expect(200);

    await request(server)
      .post('/api/init')
      .set('Cookie', [`auth_token=${users.user0.token}`])
      .expect(400);
  });

  it('should require auth', async () => {
    await request(server).post('/api/init').expect(401);
  });
});
