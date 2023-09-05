import { config } from '~/config/config.js';
import { database } from '~/database/database.js';
import { logger } from '~/logger/logger.js';

import { AppBase } from './server-app.package.js';

const serverApp = new AppBase(config, logger, database);

export { serverApp };
