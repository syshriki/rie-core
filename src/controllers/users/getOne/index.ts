import * as userDao from '../../../db/daos/userDao.ts';
import { BadRequestError } from '../../../httpErrors.ts';
import type { AppContext } from '../../../types.ts';
import type { GetOneUserParams } from './schema.ts';

export default async (ctx: AppContext): Promise<void> => {
  const { id } = ctx.sanitizedRequest.params as GetOneUserParams;

  const { userId } = ctx.state;

  const user = await userDao.findById(id);

  if (!user) {
    throw new BadRequestError(`user with id ${id} not found`, 'USER_NOT_FOUND');
  }

  ctx.body = {
    ...user,
    isCurrentUser: userId === id,
  };
};
