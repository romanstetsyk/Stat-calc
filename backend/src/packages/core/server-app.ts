import { authController } from '~/modules/auth/auth.js';
import { userController } from '~/modules/users/users.js';
import { config } from '~/packages/config/config.js';
import type { ServerApi } from '~/packages/controller/controller.js';
import { database } from '~/packages/database/database.js';
import { logger } from '~/packages/logger/logger.js';

import { ApiBase } from './api-base.package.js';
import { AppBase } from './server-app.package.js';

const apiV1: ServerApi = new ApiBase('/v1', userController, authController);

const serverApp = new AppBase(config, logger, database, [apiV1]);

export { serverApp };
