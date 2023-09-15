import { authController } from '~/auth/auth.js';
import { config } from '~/config/config.js';
import { database } from '~/database/database.js';
import { logger } from '~/logger/logger.js';
import type { ServerApi } from '~/types/types.js';
import { userController } from '~/users/users.js';

import { ApiBase } from './api-base.package.js';
import { AppBase } from './server-app.package.js';

const apiV1: ServerApi = new ApiBase('v1', userController, authController);

const serverApp = new AppBase(config, logger, database, [apiV1]);

export { serverApp };
