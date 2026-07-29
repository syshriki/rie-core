import * as userDao from '../../../db/daos/userDao.ts';
import { BadRequestError } from '../../../httpErrors.ts';
import type { Output as UserProfile } from './types.ts';
import type { AppContext } from '../../../types.ts';

export default async (ctx: AppContext<{ RespBody: UserProfile }>): Promise<void> => {
  const { userId } = ctx.state;

  const user = await userDao.findFullUserProfile(userId);

  if (!user) {
    throw new BadRequestError('Current user not found', 'USER_NOT_FOUND');
  }

  ctx.body = user;
};
