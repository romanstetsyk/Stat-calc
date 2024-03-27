import type { JWTPayload } from 'jose';

type TokenUtil = {
  decode(token: string): JWTPayload;
  isExpired(token: string, seconds?: number): boolean;
};

export type { TokenUtil };
