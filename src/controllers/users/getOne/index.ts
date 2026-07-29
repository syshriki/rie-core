import * as userDao from '../../../db/daos/userDao.ts';
import { BadRequestError } from '../../../httpErrors.ts';
import type { Output as UserProfile } from './types.ts';
import type { AppContext } from '../../../types.ts';
import type { GetOneUserParams } from './schema.ts';

export default async (ctx: AppContext<{ Params: GetOneUserParams; RespBody: UserProfile }>): Promise<void> => {
  const { id } = ctx.sanitizedRequest.params!;

  const { userId } = ctx.state;

  const user = await userDao.findFullUserProfile(id);

  if (!user) {
    throw new BadRequestError(`user with id ${id} not found`, 'USER_NOT_FOUND');
  }

  ctx.body = {
    ...user,
    isCurrentUser: userId === id,
  };
};
