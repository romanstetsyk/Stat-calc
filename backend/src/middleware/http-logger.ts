import pino from 'pino';
import { pinoHttp } from 'pino-http';

import { config } from '~/packages/config/config.js';

const HTTP_ERRORS = {
  CLIENT: 400,
  SERVER: 500,
} as const;

const httpLogger = pinoHttp({
  timestamp: pino.stdTimeFunctions.isoTime,
  customLogLevel: function (_req, res, err) {
    if (err) {
      return 'error';
    } else if (res.statusCode < HTTP_ERRORS.CLIENT) {
      // < 400
      return 'info';
    } else if (res.statusCode < HTTP_ERRORS.SERVER) {
      // >= 400 && < 500
      return 'warn';
    } else {
      // >= 500
      return 'error';
    }
  },
  transport: { targets: config.LOG.TARGETS },
});

export { httpLogger };
