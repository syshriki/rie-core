import type { Sql } from 'postgres';
import { optionalTransaction } from './utils.ts';

export interface AppConfigEntity {
  isAppInitialized: boolean;
  initializedAt: Date | null;
}

export const initializeApp = optionalTransaction(async (sql: Sql): Promise<boolean> => {
  await sql`
      INSERT INTO app_config (is_app_initialized, initialized_at) VALUES (TRUE, NOW());
    `;
  return true;
});

export const getAppConfig = optionalTransaction(
  async (sql: Sql): Promise<AppConfigEntity | null> => {
    const [config] = await sql`
      SELECT * FROM app_config LIMIT 1;
    `;

    return config as AppConfigEntity;
  }
);
