import type { JwtPayload } from 'jsonwebtoken';

import type { TOKEN_TYPES } from './constants.js';

type JWTPayload<T extends TOKEN_TYPES = TOKEN_TYPES> = {
  id: string;
  type: T;
} & JwtPayload;

type TokenUtil = {
  issueJWT<T extends TOKEN_TYPES>(payload: JWTPayload<T>): string;
  verifyJWT<T extends TOKEN_TYPES>(token: string): JWTPayload<T>;
};

export type { JWTPayload, TokenUtil };
