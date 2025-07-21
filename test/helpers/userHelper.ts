import type { Server } from 'node:http';
import request from 'supertest';
import type { UserCreateInput } from '../../src/schemas/user.ts';

export async function createUser(server: Server, token: string, user: UserCreateInput) {
  const { body } = await request(server)
    .post('/users')
    .set('Authorization', `Bearer ${token}`)
    .send(user)
    .expect(200);

  return body;
}
