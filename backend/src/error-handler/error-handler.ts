/* eslint-disable unicorn/no-process-exit */
import type { Server } from 'node:http';

import type { EXIT_CODES } from '~/constants/constants.js';
import { TIMEOUT } from '~/constants/constants.js';
import { logger } from '~/logger/logger.js';
import type { ValueOf } from '~/types/types.js';

const unexpectedErrorHandler = (
  code: ValueOf<typeof EXIT_CODES>,
  server?: Server,
): never => {
  if (server) {
    server.close(() => {
      logger.info('Server closed');
      process.exit(code);
    });
  }

  setTimeout(() => {
    process.abort(); // exit immediately and generate a core dump file
  }, TIMEOUT['1s']).unref();

  process.exit(code);
};

export { unexpectedErrorHandler };
