import { HTTP_CODES } from '~/constants/constants.js';
import type { ValueOf } from '~/types/types.js';

import { hasValue } from './has-value.js';

const isHttpCode = (code: unknown): code is ValueOf<typeof HTTP_CODES> => {
  return hasValue(HTTP_CODES, code);
};

export { isHttpCode };
