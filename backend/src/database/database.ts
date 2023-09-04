import { config } from '~/config/config.js';
import { logger } from '~/logger/logger.js';

import { BaseDatabase } from './database.package.js';

const database = new BaseDatabase(config, logger);

export { database };
export type { Database } from './types.js';
