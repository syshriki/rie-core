import * as userDao from '../../db/daos/userDao.ts';
import errors from '../../httpErrors.ts';
import type { UserEntity } from '../../schemas/user.ts';
import type { AppContext } from '../../types.ts';

async function findOrThrow(username: string): Promise<UserEntity> {
  const user = await userDao.findByUsername(username);

  if (!user) {
    throw new errors.NotFoundError(`user with username ${username} not found`);
  }

  return user;
}

async function getUserProfile(
  username: string,
  currentUsername: string,
): Promise<UserEntity & { isCurrentUser: boolean }> {
  const user = await findOrThrow(username);

  return {
    ...user,
    isCurrentUser: username === currentUsername,
  };
}

export default async (ctx: AppContext): Promise<void> => {
  const { username } = ctx.params;

  const { userId } = ctx.state;

  // Get user profile with isCurrentUser flag
  const userProfile = await getUserProfile(username, currentUsername);

  // Return user profile
  ctx.body = userProfile;
};
