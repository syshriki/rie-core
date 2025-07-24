/**
 * Helper functions for news-related tests
 */

import type { Server } from 'node:http';
import request from 'supertest';
import type { CreateNewsBody } from '../../src/controllers/news/create/schema.ts';

export async function createNews(server: Server, token: string, newsData?: CreateNewsBody) {
  const { body } = await request(server)
    .post('/news')
    .set('Cookie', [`access_token=${token}`])
    .send(
      newsData ?? {
        title: 'Test News Item',
        text: 'This is a test news item',
        type: 'announcement',
      },
    )
    .expect(201);

  return body;
}
