import type http from 'node:http';
import cors from '@koa/cors';
import config from 'config';
import Koa from 'koa';
import bodyParser from 'koa-bodyparser';
import reqLogger from 'koa-pino-logger';
import { pino } from 'pino';
import { createSqlClient } from './db/connection.ts';
import errorHandler from './middleware/errorHandler.ts';
import router from './routes.ts';
import type { AppState, ExtendedAppContext } from './types.ts';
import initializeErrorHandler from './zodConfig.ts';

const logger = pino();

initializeErrorHandler();

const createApp = async (): Promise<http.Server> => {
  const app = new Koa<AppState, ExtendedAppContext>({ proxy: true });
  const sqlClient = await createSqlClient();

  app.use(
    reqLogger({
      level: config.get<pino.LevelWithSilent>('logging.level'),
      serializers: {
        req: (req) => {
          return {
            url: req.url,
            method: req.method,
          };
        },
        res: (res) => {
          return {
            statusCode: res.statusCode,
          };
        },
      },
      redact: {
        paths: ['pid'],
        remove: true,
      },
    }),
  );
  app.use(cors({ credentials: true }));
  app.use(errorHandler);
  app.use(bodyParser());
  app.use(router.routes());
  app.use(router.allowedMethods());

  try {
    const port = config.get<number>('server.port');
    const server = app.listen(port);

    server.on('listening', () => {
      logger.info(`${process.env.NODE_ENV} server running on port ${port}`);
    });

    server.on('close', async () => {
      logger.info('Server closed, cleaning up...');
      await sqlClient.end({ timeout: 5 });
      logger.info('Database connections closed');
    });

    const shutdown = async () => {
      logger.info('Graceful shutdown initiated');
      try {
        await server.close();
        process.exit(0);
      } catch (err) {
        logger.info('Error during shutdown:', err);
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
