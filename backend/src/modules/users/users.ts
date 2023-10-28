import { config } from '~/packages/config/config.js';
import { logger } from '~/packages/logger/logger.js';
import { passwordUtil } from '~/packages/password-util/password-util.js';

import { UserController } from './user.controller.js';
import { UserModel } from './user.model.js';
import { UserRepository } from './user.repository.js';
import { UserService } from './user.service.js';

const userRepository = new UserRepository(UserModel);
const userService = new UserService(userRepository, passwordUtil);
const userController = new UserController(logger, userService, config);

export { userController, userService };
export type { UserInfo } from './types.js';
export { UserEntity } from './user.entity.js';
export type { UserService } from './user.service.js';
