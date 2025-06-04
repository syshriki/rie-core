import * as appConfig from '../daos/appConfig.ts';
import * as userDao from '../daos/userDao.ts';
import type { AppContext } from '../types.ts';

export default async (ctx: AppContext): Promise<void> => {
  const userId = ctx.state.jwt.sub;

  const app = await appConfig.getAppConfig();

  if (!app?.isAppInitialized) {
    await appConfig.initializeApp();
    const user = await userDao.create(null, { username: 'admin' });
    ctx.body = user;
  } else {
    ctx.throw(400, 'app is already initialized');
  }
};
