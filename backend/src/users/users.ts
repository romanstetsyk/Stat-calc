import { logger } from '~/logger/logger.js';

import { UserController } from './user.controller.js';
import { UserRepository } from './user.repository.js';
import { UserService } from './user.service.js';

const userRepository = new UserRepository();
const userService = new UserService(userRepository);
const userController = new UserController(logger, userService);

export { userController };
