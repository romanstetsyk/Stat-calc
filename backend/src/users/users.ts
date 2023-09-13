import { logger } from '~/logger/logger.js';

import { UserController } from './users.controller.js';

const userController = new UserController(logger);

export { userController };
