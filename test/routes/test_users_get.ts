/**
 * Tests for user retrieval endpoint
 */

import type { Server } from 'node:http';
import { expect } from 'chai';
import request from 'supertest';
import app from '../../src/app.ts';
import { nockJwks } from '../helpers/auth.ts';
import { reinitializeDatabase } from '../helpers/dbHelpers.ts';
import { createUser } from '../helpers/userHelper.ts';
import users from '../helpers/users.json' with { type: 'json' };

describe('GET /api/users/:username', () => {
  let server: Server;
  const testUsername = 'testuser';

  before(async () => {
    server = await app();
    await nockJwks();
  });

  beforeEach(async () => {
    await reinitializeDatabase();
    await createUser(server, users.user0.token, { username: testUsername });
  });

  after(async () => {
    await new Promise<void>((resolve) => {
      server.close(() => resolve());
    });
  });

  it('should get user by username', async () => {
    const response = await request(server)
      .get(`/api/users/${testUsername}`)
      .set('Cookie', [`auth_token=${users.user0.token}`])
      .expect(200);

    expect(response.body).to.have.property('username', testUsername);
    expect(response.body).to.have.property('createdAt').that.is.a('string');
  });

  it('should return 404 for non-existent user', async () => {
    const nonExistentUsername = 'nonexistentuser';

    await request(server)
      .get(`/api/users/${nonExistentUsername}`)
      .set('Cookie', [`auth_token=${users.user0.token}`])
      .expect(404);
  });

  it('should require authentication', async () => {
    await request(server).get(`/api/users/${testUsername}`).expect(401);
  });
});
