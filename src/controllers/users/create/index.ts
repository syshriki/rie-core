import * as userDao from '../../../db/daos/userDao.ts';
import * as daoUtils from '../../../db/utils.ts';
import { InternalServerError } from '../../../httpErrors.ts';
import type { UserEntity } from '../../../schemas/user.ts';
import type { AppContext } from '../../../types.ts';
import { generateUniqueUsername } from './userNameGenerator.ts';

const maxTries = 5;

export default async (ctx: AppContext): Promise<void> => {
  const userId = Number(ctx.state.jwt.sub);

  ctx.log.debug({ id: userId }, 'creating user');

  let user: UserEntity | undefined;
  for (let i = 0; i < maxTries; i++) {
    const username = generateUniqueUsername();

    user = await userDao
      .create({
        id: userId,
        username,
      })
      .catch(
        daoUtils.duplicateKeyErrorHandler({
          constraint: 'users_username_key',
          ignore: true,
        }),
      )
      .catch(
        daoUtils.duplicateKeyErrorHandler({
          message: `user ${userId} already exists`,
          code: 'USER_EXISTS',
          constraint: 'users_pkey',
        }),
      );

    if (user) {
      break;
    }
    ctx.log.warn(
      { userId, username, attempt: i + 1 },
      'failed to create unique username, retrying',
    );
  }

  if (!user) {
    throw new InternalServerError(
      `failed to create user after ${maxTries} multiple attempts`,
      'MAX_TRIES_EXCEEDED',
    );
  }

  ctx.log.info({ userId, username: user.username }, 'created user');

  ctx.body = user;
};
