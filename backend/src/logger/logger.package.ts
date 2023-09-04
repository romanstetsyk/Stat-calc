import path from 'node:path';

import type { Logger as PinoLogger, TransportTargetOptions } from 'pino';
import { pino } from 'pino';

import type { ConfigSchema } from '~/config/types.js';

class BaseLogger {
  private config: ConfigSchema;
  private logger: PinoLogger;

  public constructor(config: ConfigSchema) {
    this.config = config;

    const {
      ENV,
      LOG: { LEVEL, FILE },
    } = this.config;

    const targets: TransportTargetOptions[] = [
      {
        level: LEVEL,
        target: 'pino/file', // prints json to console if no destination in options
        options: {},
      },
    ];

    if (FILE) {
      const logFilename = `logs-${ENV}-${LEVEL}.log`;
      targets.push({
        level: LEVEL,
        target: 'pino/file',
        options: { destination: path.join('logs', logFilename), mkdir: true },
      });
    }

    this.logger = pino(
      {
        timestamp: pino.stdTimeFunctions.isoTime,
      },
      pino.transport({ targets }),
    );

    this.logger.info('Logger is created...');
  }

  public fatal(
    message: string,
    parameters: Record<string, unknown> = {},
  ): ReturnType<PinoLogger['fatal']> {
    this.logger.fatal(parameters, message);
  }

  public error(
    message: string,
    parameters: Record<string, unknown> = {},
  ): ReturnType<PinoLogger['error']> {
    this.logger.error(parameters, message);
  }

  public warn(
    message: string,
    parameters: Record<string, unknown> = {},
  ): ReturnType<PinoLogger['warn']> {
    this.logger.warn(parameters, message);
  }

  public info(
    message: string,
    parameters: Record<string, unknown> = {},
  ): ReturnType<PinoLogger['info']> {
    this.logger.info(parameters, message);
  }

  public debug(
    message: string,
    parameters: Record<string, unknown> = {},
  ): ReturnType<PinoLogger['debug']> {
    this.logger.debug(parameters, message);
  }

  public trace(
    message: string,
    parameters: Record<string, unknown> = {},
  ): ReturnType<PinoLogger['trace']> {
    this.logger.trace(parameters, message);
  }
}

type Logger = InstanceType<typeof BaseLogger>;

export type { Logger };
export { BaseLogger };
