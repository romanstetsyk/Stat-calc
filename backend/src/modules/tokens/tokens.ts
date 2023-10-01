import { tokenUtil } from '~/packages/token-util/token-util.js';

import { TokenModel } from './token.model.js';
import { TokenRepository } from './token.repository.js';
import { TokenService } from './token.service.js';

const tokenRepository = new TokenRepository(TokenModel);
const tokenService = new TokenService(tokenRepository, tokenUtil);

export { tokenService };
export { TokenEntity } from './token.entity.js';
export { TokenModel } from './token.model.js';
export { TokenRepository } from './token.repository.js';
export { TokenService } from './token.service.js';
export type { TokenBody } from './types.js';
