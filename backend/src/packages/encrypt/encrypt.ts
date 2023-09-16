import { config } from '~/packages/config/config.js';

import { EncryptBase } from './encrypt.package.js';

const encrypt = new EncryptBase(config);

export { encrypt };
export type { Encrypt } from './types.js';
