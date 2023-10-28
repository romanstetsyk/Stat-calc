import { tokenService } from '~/modules/tokens/tokens.js';
import { userService } from '~/modules/users/users.js';
import { config } from '~/packages/config/config.js';
import { logger } from '~/packages/logger/logger.js';
import { passwordUtil } from '~/packages/password-util/password-util.js';
import { tokenUtil } from '~/packages/token-util/token-util.js';

import { AuthController } from './auth.controller.js';
import { AuthService } from './auth.service.js';

const authService = new AuthService(
  userService,
  tokenService,
  passwordUtil,
  tokenUtil,
);
const authController = new AuthController(logger, authService, config);

export { authController };
