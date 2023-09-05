import { EXIT_CODES } from '~/constants/constants.js';
import { unexpectedErrorHandler } from '~/error-handler/error-handler.js';
import { logger } from '~/logger/logger.js';

import { server } from './index.js';

process.on(
  'unhandledRejection',
  (reason: Error | unknown, promise: Promise<unknown>) => {
    logger.fatal('Unhandled Rejection', { promise, reason });
    unexpectedErrorHandler(EXIT_CODES.FATAL, server);
  },
);

process.on('uncaughtException', (error: Error) => {
  logger.fatal(`Uncaught Exception: ${error.message}`, { error });
  unexpectedErrorHandler(EXIT_CODES.FATAL, server);
});

process.on('SIGTERM', () => {
  logger.fatal(`Process ${process.pid} received SIGTERM: Exiting with code 0`);
  unexpectedErrorHandler(EXIT_CODES.SUCCESS, server);
});

process.on('SIGINT', () => {
  logger.fatal(`Process ${process.pid} received SIGINT: Exiting with code 0`);
  unexpectedErrorHandler(EXIT_CODES.SUCCESS, server);
});
