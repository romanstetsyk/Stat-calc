import type { Logger as PinoLogger } from 'pino';
import { pino } from 'pino';

import type { Config } from '~/packages/config/config.js';

import type { Logger } from './types.js';

class BaseLogger implements Logger {
  private config: Config;
  private logger: PinoLogger;

  public constructor(config: Config) {
    this.config = config;

    this.logger = pino(
      {
        timestamp: pino.stdTimeFunctions.isoTime,
      },
      pino.transport({ targets: this.config.LOG.TARGETS }),
    );

    this.logger.info('Logger is created...');
  }

  public get level(): string {
    return this.logger.level;
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

  public silent(
    message: string,
    parameters: Record<string, unknown> = {},
  ): ReturnType<PinoLogger['silent']> {
    this.logger.silent(parameters, message);
  }
}

export { BaseLogger };
