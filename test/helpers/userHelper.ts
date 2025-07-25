import type { Server } from 'node:http';
import request from 'supertest';

export async function createUser(server: Server, token: string) {
  const { body } = await request(server)
    .post('/users')
    .set('Authorization', `Bearer ${token}`)
    .expect(200);

  return body;
}
