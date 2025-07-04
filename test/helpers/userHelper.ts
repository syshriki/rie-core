import type { Server } from 'node:http';
import request from 'supertest';
import type { UserEntity } from '../../src/schemas/user.ts';

export async function createUser(server: Server, token: string, user: UserEntity) {
  const { body } = await request(server)
    .post('/api/users')
    .set('Cookie', [`auth_token=${token}`])
    .send(user)
    .expect(200);

  return body;
}
