import type http from 'node:http';
import cors from '@koa/cors';
import config from 'config';
import Koa from 'koa';
import bodyParser from 'koa-bodyparser';
import logger from 'koa-pino-logger';
import serve from 'koa-static';
import { sql } from './daos/db.ts';
import errorHandler from './middleware/errorHandler.ts';
import router from './routes.ts';

import initializeErrorHandler from './zodConfig.ts';

initializeErrorHandler();


const createApp = async (): Promise<http.Server> => {
  const app = new Koa({ proxy: true });

  app.use(logger({
    level: config.get<string>('logging.level'),
    useLevelLabels: true,
    redact: {
      paths: ['req', 'res', 'pid'],
      remove: true
    }
  }));
  app.use(cors({ credentials: true }));
  app.use(errorHandler);
  app.use(bodyParser());
  app.use(serve('./static'));
  app.use(router.routes());
  app.use(router.allowedMethods());

  try {
    const port = config.get<number>('server.port');
    const server = app.listen(port);

    server.on('listening', () => {
      console.log(`${process.env.NODE_ENV} server running on port ${port}`);
    });

    server.on('close', async () => {
      console.log('Server closed, cleaning up...');
      await sql.end({ timeout: 5 });
      console.log('Database connections closed');
    });

    const shutdown = async () => {
      console.log('Graceful shutdown initiated');
      try {
        await server.close();
        process.exit(0);
      } catch (err) {
        console.log('Error during shutdown:', err);
        process.exit(1);
      }
    };

    process.on('SIGTERM', shutdown);
    process.on('SIGINT', shutdown);

    return server;
  } catch (err) {
    console.error(err);
    throw err;
  }
};

export default createApp;
