import { config } from '~/packages/config/config.js';
import { logger } from '~/packages/logger/logger.js';

import { BaseDatabase } from './database.package.js';

const database = new BaseDatabase(config, logger);

export { database };
export type { Database } from './types.js';
