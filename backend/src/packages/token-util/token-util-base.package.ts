import jwt from 'jsonwebtoken';

import type { Config } from '~/packages/config/config.js';

import type { TOKEN_TYPES } from './constants.js';
import { isJWTPayload } from './helpers.js';
import type { JWTPayload, TokenUtil } from './types.js';

class TokenUtilBase implements TokenUtil {
  private config: Config['JWT'];

  public constructor(config: Config['JWT']) {
    this.config = config;
  }

  public issueJWT<T extends TOKEN_TYPES>(payload: JWTPayload<T>): string {
    switch (payload.type) {
      case 'access': {
        return jwt.sign(payload, this.config.SECRET, {
          expiresIn: `${this.config.ACCESS_EXPIRATION_MINUTES}m`,
        });
      }
      case 'refresh': {
        return jwt.sign(payload, this.config.SECRET, {
          expiresIn: `${this.config.REFRESH_EXPIRATION_DAYS}d`,
        });
      }
      default: {
        throw new Error('Unknown token type');
      }
    }
  }

  public verifyJWT<T extends TOKEN_TYPES>(token: string): JWTPayload<T> {
    const decodedPayload = jwt.verify(token, this.config.SECRET);
    if (
      typeof decodedPayload === 'string' ||
      !isJWTPayload<T>(decodedPayload)
    ) {
      throw new Error('Token error');
    }
    return decodedPayload;
  }
}

export { TokenUtilBase };
