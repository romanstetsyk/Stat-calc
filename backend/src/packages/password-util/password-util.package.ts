import { compare, hash } from 'bcrypt';

import type { Config } from '~/packages/config/config.js';

import type { PasswordUtil } from './types.js';

class PasswordUtilBase implements PasswordUtil {
  private config: Config;

  public constructor(config: Config) {
    this.config = config;
  }

  public async hash(data: string): Promise<string> {
    const { PASSWORD_SALT_ROUNDS } = this.config.ENCRYPT;
    return await hash(data, PASSWORD_SALT_ROUNDS);
  }

  public async compare(data: string, encrypted: string): Promise<boolean> {
    return await compare(data, encrypted);
  }
}

export { PasswordUtilBase };
