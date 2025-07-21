/**
 * Tests for user API endpoints
 */

import fs from 'node:fs';
import type { Server } from 'node:http';
import { expect } from 'chai';
import sinon from 'sinon';
import request from 'supertest';
import app from '../../src/app.ts';
import { nockJwks } from '../helpers/auth.ts';
import { reinitializeDatabase } from '../helpers/dbHelpers.ts';
import users from '../helpers/users.json' with { type: 'json' };

describe('POST /users', () => {
  let server: Server;
  let mathRandomStub: sinon.SinonStub;
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

  afterEach(() => {
    mathRandomStub?.restore();
  });

  it('should 200 with valid un-registered sub in bearer', async () => {
    const { body } = await request(server)
      .post('/users')
      .set('Authorization', `Bearer ${users.user0.token}`)
      .send({ id: 'testuser' })
      .expect(200);

    expect(body).to.have.property('id', 0);
    expect(body).to.have.property('username').that.is.a('string');
    expect(body).to.have.property('createdAt').that.is.a('string');
  });

  it('should 409 Conflict if user id already used', async () => {
    await request(server)
      .post('/users')
      .set('Authorization', `Bearer ${users.user0.token}`)
      .expect(200);

    await request(server)
      .post('/users')
      .set('Authorization', `Bearer ${users.user0.token}`)
      .expect(409);
  });

  it('should 500 after 5 username generation attempts', async () => {
    mathRandomStub = sinon.stub(Math, 'random').returns(0);

    await request(server)
      .post('/users')
      .set('Authorization', `Bearer ${users.user0.token}`)
      .expect(200);

    // Since there's only one possible username combination,
    // the next attempt should fail after 5 retries
    await request(server)
      .post('/users')
      .set('Authorization', `Bearer ${users.user1.token}`)
      .expect(500);
  });
});
