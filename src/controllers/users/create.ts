import * as userDao from '../../daos/userDao.ts';
import * as daoUtils from '../../daos/utils.ts';
import type { UserCreateInput, UserEntity } from '../../schemas/user.ts';
import type { AppContext } from '../../types.ts';

async function createUser(username: string): Promise<UserEntity> {
  const user: Omit<UserEntity, 'id'> = {
    username,
  };

  return await userDao.create(null, user);
}

export default async (ctx: AppContext): Promise<void> => {
  const userData = ctx.state.validatedBody as UserCreateInput;

  const user = await createUser(userData.username).catch(
    daoUtils.duplicateKeyErrorHandler({ message: `'${userData.username}' already exists` })
  );

  ctx.body = user;
};
