import * as userDao from '../../../db/daos/userDao.ts';
import * as daoUtils from '../../../db/utils.ts';
import { BadRequestError } from '../../../httpErrors.ts';
import type { UserEntity } from '../../../schemas/user.ts';
import type { AppContext } from '../../../types.ts';
import type { UpdateUserBody } from './schema.ts';

export default async (
  ctx: AppContext<{
    ReqBody: UpdateUserBody;
    RespBody: UserEntity;
  }>,
): Promise<void> => {
  const { username } = ctx.sanitizedRequest.body!;
  const { userId } = ctx.state;

  const user = await userDao.findById(userId);

  if (!user) {
    throw new BadRequestError('current user not found', 'USER_NOT_FOUND');
  }

  const updatedUser = await userDao
    .updateUsername(userId, username)
    .catch(
      daoUtils.duplicateKeyErrorHandler({
        message: `username '${username}' is already taken`,
        code: 'USERNAME_TAKEN',
        constraint: 'users_username_key',
      }),
    );

  // duplicateKeyErrorHandler always throws when ignore is not set
  ctx.body = updatedUser!;
};
