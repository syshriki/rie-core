/**
 * Tests for news listing endpoint
 */

import type { Server } from 'node:http';
import { expect } from 'chai';
import request from 'supertest';
import app from '../../src/app.ts';
import { reinitializeDatabase } from '../helpers/dbHelpers.ts';

describe('GET /news', () => {
  const testUsername = 'testuser';
  let server: Server;

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

  it('should get all news with pagination', async () => {
    const response = await request(server).get('/news').set('X-Username', testUsername).expect(200);

    expect(response.body).to.have.property('news').that.is.an('array');
    expect(response.body.news).to.have.length(2);
    expect(response.body).to.have.property('hasMore', false);
    expect(response.body.news[0]).to.have.property('title', 'News Item 2'); // Most recent first
  });

  it('should support pagination with cursor', async () => {
    // First get all news to get a cursor
    const firstResponse = await request(server)
      .get('/news')
      .set('X-Username', testUsername)
      .expect(200);

    const cursor = firstResponse.body.news[0].createdAt;

    // Create another news item
    await createNewsItem('News Item 3', server);

    // Get news with cursor
    const response = await request(server)
      .get(`/news?cursor=${cursor}`)
      .set('X-Username', testUsername)
      .expect(200);

    expect(response.body).to.have.property('news').that.is.an('array');
    expect(response.body.news).to.have.length(1);
    expect(response.body.news[0]).to.have.property('title', 'News Item 1');
  });

  it('should require authentication', async () => {
    await request(server).get('/news').expect(401);
  });
});

// Helper function to create a news item
async function createNewsItem(title: string, server: Server) {
  await request(server)
    .post('/news')
    .set('X-Username', 'testuser')
    .send({
      title,
      content: `Content for ${title}`,
      recipeId: null,
    })
    .expect(201);
}
