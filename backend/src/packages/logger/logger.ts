import { config } from '~/packages/config/config.js';

import { BaseLogger } from './logger.package.js';

const logger = new BaseLogger(config);

export { logger };
export type { Logger } from './types.js';
