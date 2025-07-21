import type { Sql } from 'postgres';

export interface AppConfigEntity {
  isAppInitialized: boolean;
  initializedAt: Date | null;
}

export const initializeApp = async (sql: Sql): Promise<boolean> => {
  await sql`
      INSERT INTO app_config (is_app_initialized, initialized_at) VALUES (TRUE, NOW());
    `;
  return true;
};

export const getAppConfig = async (sql: Sql): Promise<AppConfigEntity | null> => {
  const [config] = await sql`
      SELECT * FROM app_config LIMIT 1;
  `;
  return config as AppConfigEntity;
};
