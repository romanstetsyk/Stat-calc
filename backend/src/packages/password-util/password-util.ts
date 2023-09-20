import { config } from '~/packages/config/config.js';

import { PasswordUtilBase } from './password-util.package.js';

const passwordUtil = new PasswordUtilBase(config);

export { passwordUtil };
export type { PasswordUtil } from './types.js';
