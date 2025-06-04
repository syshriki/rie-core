/**
 * Tests for user retrieval endpoint
 */

import type { Server } from 'node:http';
import { expect } from 'chai';
import request from 'supertest';
import app from '../../src/app.ts';
import { reinitializeDatabase } from '../helpers/dbHelpers.ts';

describe('GET /api/users/:username', () => {
  let server: Server;
  const testUsername = 'testuser';

  // Setup server before all tests
  before(async () => {
    server = await app();
  });

  after(async () => {
    await new Promise<void>((resolve) => {
      server.close(() => resolve());
    });
  });

  beforeEach(async () => {
    await reinitializeDatabase();
  });

  it('should get user by username', async () => {
    const response = await request(server)
      .get(`/api/users/${testUsername}`)
      .set('X-Username', testUsername)
      .expect(200);

    expect(response.body).to.have.property('username', testUsername);
    expect(response.body).to.have.property('createdAt').that.is.a('number');
  });

  it('should return 404 for non-existent user', async () => {
    const nonExistentUsername = 'nonexistentuser';

    await request(server)
      .get(`/api/users/${nonExistentUsername}`)
      .set('X-Username', testUsername)
      .expect(404);
  });

  it('should require authentication', async () => {
    await request(server).get(`/api/users/${testUsername}`).expect(401);
  });
});
