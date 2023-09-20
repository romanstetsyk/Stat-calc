import { config } from '~/packages/config/config.js';

import { TokenUtilBase } from './token-util-base.package.js';

const tokenUtil = new TokenUtilBase(config.JWT);

export { tokenUtil };
export { TOKEN_TYPES } from './constants.js';
export { isJWTPayload } from './helpers.js';
export type { JWTPayload } from './types.js';
