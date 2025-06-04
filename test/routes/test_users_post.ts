/**
 * Tests for user API endpoints
 */

import type { Server } from 'node:http';
import { expect } from 'chai';
import request from 'supertest';
import app from '../../src/app.ts';
import { reinitializeDatabase } from '../helpers/dbHelpers.ts';

describe('POST /api/users', () => {
  let server: Server;
  const testUsername = 'testuser';

  // Setup server before all tests in this file
  before(async () => {
    server = await app();
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
      .post('/api/users')
      .send({ username: 'testuser' })
      .expect(201);

    expect(response.body).to.have.property('username', 'testuser');
    expect(response.body).to.have.property('createdAt').that.is.a('number');
  });

  it('should return 409 Conflict if user already exists', async () => {
    // First create the user
    await request(server).post('/api/users').send({ username: 'testuser' }).expect(201);

    // Try to create the same user again
    const response = await request(server)
      .post('/api/users')
      .send({ username: 'testuser' })
      .expect(409);

    expect(response.body).to.have.property('error', 'User already exists');
  });

  it('should validate username', async () => {
    const response = await request(server).post('/api/users').send({ username: '' }).expect(422);

    expect(response.body).to.have.property('error', 'Validation Error');
  });
});
