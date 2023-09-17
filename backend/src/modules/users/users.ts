import { encrypt } from '~/packages/encrypt/encrypt.js';
import { logger } from '~/packages/logger/logger.js';

import { UserController } from './user.controller.js';
import { UserModel } from './user.model.js';
import { UserRepository } from './user.repository.js';
import { UserService } from './user.service.js';

const userRepository = new UserRepository(UserModel);
const userService = new UserService(userRepository, encrypt);
const userController = new UserController(logger, userService);

export { userController, userService };
export { UserEntity } from './user.entity.js';
export type { UserService } from './user.service.js';
