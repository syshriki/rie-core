import * as userDao from '../../daos/userDao.ts';
import type { AppContext } from '../../types.ts';
import type { SignUpRequestBody } from './requestBody.ts';

export default async (ctx: AppContext): Promise<void> => {
  const app = ctx.state.validatedBody as SignUpRequestBody;
  // decode and get issuer and audience
  // check if issuer is supported and audience is correct
  // get validator and validate

  // Pull down user email (maybe firstName and lastName?)

  const user = await userDao.create(null, { username: 'admin' });
};
