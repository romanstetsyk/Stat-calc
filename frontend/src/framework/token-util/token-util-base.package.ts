import { ERROR_MESSAGES, TIMEOUT } from '@shared/build/esm/index';
import type { JWTPayload } from 'jose';
import { decodeJwt } from 'jose';

import type { TokenUtil } from './types';

class TokenUtilBase implements TokenUtil {
  public decode(token: string): JWTPayload {
    return decodeJwt(token);
  }

  public isExpired(token: string, seconds = 0): boolean {
    const { exp } = decodeJwt(token);
    if (!exp) {
      throw new Error(ERROR_MESSAGES.MISSING_EXP_CLAIM);
    }
    const remainingSeconds = exp - Date.now() / TIMEOUT['1s'];
    return remainingSeconds <= seconds;
  }
}

export { TokenUtilBase };
