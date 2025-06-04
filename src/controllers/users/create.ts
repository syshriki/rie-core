import * as userDao from '../../daos/userDao.ts';
import { ConflictError } from '../../errors.ts';
import type { UserCreateInput, UserEntity } from '../../schemas/user.ts';
import type { AppContext } from '../../types.ts';

async function userExists(username: string): Promise<boolean> {
  return await userDao.userExists(null, username);
}

async function createUser(username: string): Promise<UserEntity> {
  const user: Omit<UserEntity, 'id'> = {
    username,
    createdAt: Math.floor(Date.now() / 1000),
  };

  return await userDao.create(null, user);
}

export default async (ctx: AppContext): Promise<void> => {
  const userData = ctx.state.validatedBody as UserCreateInput;

  const exists = await userExists(userData.username);
  if (exists) {
    throw new ConflictError('User already exists');
  }

  const user = await createUser(userData.username);

  ctx.body = user;
};
