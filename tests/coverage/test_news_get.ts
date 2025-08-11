/**
 * Tests for news listing endpoint
 */

import type { Server } from 'node:http';
import { expect } from 'chai';
import request from 'supertest';
import app from '../../src/app.ts';
import type { UserEntity } from '../../src/schemas/user.ts';
import { nockJwks } from '../helpers/auth.ts';
import { reinitializeDatabase } from '../helpers/dbHelpers.ts';
import { createNews } from '../helpers/newsHelper.ts';
import { createUser } from '../helpers/userHelper.ts';
import users from '../helpers/users.json' with { type: 'json' };

describe('/news GET', () => {
  let server: Server;
  let user: UserEntity;

  before(async () => {
    server = await app();
    nockJwks();
  });

  beforeEach(async () => {
    await reinitializeDatabase();
    user = await createUser(server, users.user0.token);
    await createNews(server, users.user0.token, {
      title: 'News Item 1',
      text: 'This is the first news item',
      type: 'announcement',
    });

    await createNews(server, users.user0.token, {
      title: 'News Item 2',
      text: 'This is the second news item',
      type: 'announcement',
    });
  });

  after(async () => {
    await new Promise<void>((resolve) => {
      server.close(() => resolve());
    });
  });

  it('should get all news with pagination', async () => {
    const response = await request(server)
      .get('/news')
      .set('Cookie', [`access_token=${users.user0.token}`])
      .expect(200);

    expect(response.body).to.have.property('news').that.is.an('array');
    expect(response.body.news).to.have.length(2);
    expect(response.body).to.have.property('hasMore', false);
    expect(response.body.news[0]).to.have.property('title', 'News Item 2');
  });

  it('should support pagination with cursor', async () => {
    const firstResponse = await request(server)
      .get('/news')
      .set('Cookie', [`access_token=${users.user0.token}`])
      .expect(200);

    const cursor = firstResponse.body.news[0].createdAt;

    // Create another news item
    await createNews(server, users.user0.token, {
      title: 'News Item 3',
      text: 'This is the third news item',
      type: 'announcement',
    });

    // Get news with cursor
    const response = await request(server)
      .get(`/news?cursor=${cursor}`)
      .set('Cookie', [`access_token=${users.user0.token}`])
      .expect(200);

    expect(response.body).to.have.property('news').that.is.an('array');
    expect(response.body.news).to.have.length(1);
    expect(response.body.news[0]).to.have.property('title', 'News Item 1');
  });

  it('should require authentication', async () => {
    await request(server).get('/news').expect(401);
  });
});
