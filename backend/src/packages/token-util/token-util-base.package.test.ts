import jwt from 'jsonwebtoken';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import type { Config } from '~/packages/config/config.js';

import { TOKEN_TYPES } from './constants.js';
import { TokenUtilBase } from './token-util-base.package.js';

const M_TO_S = 60;
const H_TO_M = 60;
const D_TO_H = 24;

const testConfig: Config['JWT'] = {
  SECRET: 'super secret',
  ACCESS_EXPIRATION_MINUTES: 15,
  REFRESH_EXPIRATION_DAYS: 20,
};

const testPayloadAccess = { id: '123', type: TOKEN_TYPES.ACCESS };
const testPayloadRefresh = { id: '123', type: TOKEN_TYPES.REFRESH };

vi.spyOn(jwt, 'sign');

describe('TokenUtilBase', () => {
  let token: TokenUtilBase;
  beforeEach(() => {
    token = new TokenUtilBase(testConfig);
  });

  describe('issueJWT', () => {
    it('should throw error for unknown token type', () => {
      expect(() =>
        token.issueJWT({
          ...testPayloadAccess,
          type: 'qwerty' as TOKEN_TYPES,
        }),
      ).toThrow('Unknown token type');
    });

    describe('access token', () => {
      it('should create a token', () => {
        const jwtToken = token.issueJWT(testPayloadAccess);
        expect(jwt.sign).toHaveBeenCalledOnce();
        expect(typeof jwtToken).toBe('string');
      });

      it('should have correct payload', () => {
        const jwtToken = token.issueJWT(testPayloadAccess);
        const decodedPayload = jwt.decode(jwtToken);
        expect(decodedPayload).toHaveProperty('id', '123');
        expect(decodedPayload).toHaveProperty('exp');
        expect(decodedPayload).toHaveProperty('iat');
      });

      it('should have correct expiration time', () => {
        const jwtToken = token.issueJWT(testPayloadAccess);
        const decodedToken = jwt.decode(jwtToken);
        // needed to extract .exp and .iat properties
        if (
          typeof decodedToken !== 'object' ||
          // eslint-disable-next-line @typescript-eslint/prefer-optional-chain
          decodedToken === null ||
          !decodedToken.exp ||
          !decodedToken.iat
        ) {
          throw new Error('Incorrect shape of decoded token');
        }
        const duration = decodedToken.exp - decodedToken.iat;
        expect(duration).toBe(testConfig.ACCESS_EXPIRATION_MINUTES * M_TO_S);
        expect(decodedToken).toHaveProperty('exp');
      });
    });

    describe('refresh token', () => {
      it('should create a refresh token', () => {
        const jwtToken = token.issueJWT(testPayloadRefresh);
        expect(jwt.sign).toHaveBeenCalledOnce();
        expect(typeof jwtToken).toBe('string');
      });

      it('should have correct payload', () => {
        const jwtToken = token.issueJWT(testPayloadRefresh);
        const decodedPayload = jwt.decode(jwtToken);
        expect(decodedPayload).toHaveProperty('id', '123');
        expect(decodedPayload).toHaveProperty('exp');
        expect(decodedPayload).toHaveProperty('iat');
      });

      it('should have correct expiration time', () => {
        const jwtToken = token.issueJWT(testPayloadRefresh);
        const decodedToken = jwt.decode(jwtToken);
        // needed to extract .exp and .iat properties
        if (
          typeof decodedToken !== 'object' ||
          // eslint-disable-next-line @typescript-eslint/prefer-optional-chain
          decodedToken === null ||
          !decodedToken.exp ||
          !decodedToken.iat
        ) {
          throw new Error('Incorrect shape of decoded token');
        }
        const duration = decodedToken.exp - decodedToken.iat;
        expect(duration).toBe(
          testConfig.REFRESH_EXPIRATION_DAYS * D_TO_H * H_TO_M * M_TO_S,
        );
        expect(decodedToken).toHaveProperty('exp');
      });
    });
  });

  describe('verifyJWT', () => {
    it('should correctly decode valid token', () => {
      const jwtToken = token.issueJWT(testPayloadAccess);
      const decodedPayload = token.verifyJWT(jwtToken);
      expect(decodedPayload).toHaveProperty('id', '123');
      expect(decodedPayload).toHaveProperty('exp');
      expect(decodedPayload).toHaveProperty('iat');
    });

    it('should throw if token is malformed', () => {
      expect(() => token.verifyJWT('lolol')).toThrowError('jwt malformed');
    });

    it('should throw if token expired', () => {
      const expiredToken =
        'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjEyMyIsImlhdCI6MTY5NTA1MjgyNCwiZXhwIjoxNjk1MDU2NDI0fQ._Sjf8TwA20GaqWYq2sjWhiLcjXqKMJMAejn_8vrSR1E';
      expect(() => token.verifyJWT(expiredToken)).toThrowError('jwt expired');
    });
  });
});
