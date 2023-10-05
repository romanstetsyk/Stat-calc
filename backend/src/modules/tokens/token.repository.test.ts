/* eslint-disable @typescript-eslint/no-magic-numbers */
import { v4 as uuidv4 } from 'uuid';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';

import { Database } from '#/test/helpers/mongo-memory-server.js';
import { TOKEN_TYPES } from '~/packages/token-util/constants.js';

import type { TokenBody } from './tokens.js';
import { TokenEntity, TokenModel, TokenRepository } from './tokens.js';

describe('token repository', () => {
  const testDb = new Database();
  const token1: TokenBody = {
    type: TOKEN_TYPES.REFRESH,
    userId: uuidv4(),
    token: 'testtoken',
    blacklisted: false,
  };

  const token2: TokenBody = {
    token: 'a new token',
    type: TOKEN_TYPES.REFRESH,
    userId: token1.userId,
    blacklisted: false,
  };
  let tokenRepository: TokenRepository;

  beforeEach(async () => {
    tokenRepository = new TokenRepository(TokenModel);
    await testDb.setUp();
  });

  afterEach(async () => {
    await testDb.tearDown();
  });

  describe('saveToken', () => {
    it('should save token correctly', async () => {
      const token = await tokenRepository.saveToken(token1);
      expect(token).toBeInstanceOf(TokenEntity);
      expect(token.token).toBe(token1.token);
    });
  });

  describe('getAll', () => {
    it('should have empty array for empty db', async () => {
      const tokens = await tokenRepository.getAll();
      expect(tokens).toHaveLength(0);
    });

    it('should have length 1 after token is added', async () => {
      await tokenRepository.saveToken(token1);
      const tokens = await tokenRepository.getAll();
      expect(tokens).toHaveLength(1);
      expect(tokens[0]).toBeInstanceOf(TokenEntity);
    });
  });

  describe('delete', () => {
    it('should return null if token was not deleted', async () => {
      const { userId, token } = token1;
      const deletedToken = await tokenRepository.delete({ userId, token });
      expect(deletedToken).toBeNull();
    });

    it('should return deleted token', async () => {
      await tokenRepository.saveToken(token1);
      const { userId, token } = token1;
      const deletedToken = await tokenRepository.delete({ userId, token });
      expect(deletedToken).toBeInstanceOf(TokenEntity);
      expect(deletedToken?.token).toBe(token);
    });
  });

  describe('update', () => {
    it('should return null if no token was updated', async () => {
      const updatedToken = await tokenRepository.update(token1, token2);
      expect(updatedToken).toBeNull();
    });

    it('should return updated token', async () => {
      await tokenRepository.saveToken(token1);
      const updatedToken = await tokenRepository.update(token1, token2);
      expect(updatedToken).toBeInstanceOf(TokenEntity);
    });

    it('should update createdAt and updatedAt timestamps', async () => {
      const timeout = 100;
      const token = await tokenRepository.saveToken(token1);

      const updatedToken: TokenEntity = await new Promise((resolve, reject) => {
        setTimeout(async () => {
          const t = await tokenRepository.update(token1, token2);
          t ? resolve(t) : reject(t);
        }, timeout);
      });

      expect(
        updatedToken.createdAt.getTime() - token.createdAt.getTime(),
      ).toBeGreaterThan(timeout);
      expect(
        updatedToken.updatedAt.getTime() - token.updatedAt.getTime(),
      ).toBeGreaterThan(timeout);
    });
  });
});
