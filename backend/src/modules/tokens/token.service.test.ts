/* eslint-disable @typescript-eslint/no-magic-numbers */
import { v4 as uuidv4 } from 'uuid';
import { afterAll, afterEach, beforeAll, describe, expect, it } from 'vitest';

import { Database } from '#/test/helpers/mongo-memory-server.js';
import { TOKEN_TYPES, tokenUtil } from '~/packages/token-util/token-util.js';

import { TokenModel, TokenRepository, TokenService } from './tokens.js';

describe('token service', () => {
  const testDb = new Database();
  let tokenRepository: TokenRepository;
  let tokenService: TokenService;

  beforeAll(async () => {
    tokenRepository = new TokenRepository(TokenModel);
    tokenService = new TokenService(tokenRepository, tokenUtil);
    await testDb.setUp();
  });

  afterAll(async () => {
    await testDb.tearDown();
  });

  afterEach(async () => {
    await testDb.clearDB();
  });

  describe('saveRefreshToken', () => {
    it('should save refresh token', async () => {
      const token = 'test.token';
      const userId = uuidv4();
      await tokenService.saveRefreshToken(token, userId);
      const [savedToken] = await tokenRepository.getAll();
      expect(savedToken.token).toBe(token);
      expect(savedToken.type).toBe(TOKEN_TYPES.REFRESH);
    });
  });

  describe('generateTokens', () => {
    it('should create two tokens', () => {
      const { accessToken, refreshToken } =
        tokenService.generateTokens('testId');
      expect(typeof accessToken).toBe('string');
      expect(typeof refreshToken).toBe('string');
    });

    it('should encode userId', () => {
      const userId = uuidv4();
      const { accessToken, refreshToken } = tokenService.generateTokens(userId);

      const { id: idAccess } = tokenUtil.verifyJWT(accessToken);
      expect(idAccess).toBe(userId);

      const { id: idRefresh } = tokenUtil.verifyJWT(refreshToken);
      expect(idRefresh).toBe(userId);
    });

    it('should create one access and one refresh token', () => {
      const userId = uuidv4();
      const { accessToken, refreshToken } = tokenService.generateTokens(userId);

      const { type: typeAccess } = tokenUtil.verifyJWT(accessToken);
      expect(typeAccess).toBe(TOKEN_TYPES.ACCESS);

      const { type: typeRefresh } = tokenUtil.verifyJWT(refreshToken);
      expect(typeRefresh).toBe(TOKEN_TYPES.REFRESH);
    });
  });

  describe('deleteToken', () => {
    it('should delete token', async () => {
      const token = 'test.token';
      const userId = uuidv4();
      await tokenService.saveRefreshToken(token, userId);
      await tokenService.deleteToken({ token });
      const existingTokens = await tokenRepository.getAll();
      expect(existingTokens).toHaveLength(0);
    });
  });

  describe('updateRefreshToken', () => {
    it('should throw if no token was updated', async () => {
      const [userId, oldToken, newToken] = [uuidv4(), 'oldToken', 'newToken'];
      const upd = async (): Promise<string> =>
        await tokenService.updateRefreshToken(userId, oldToken, newToken);
      await expect(upd).rejects.toThrowError();
    });

    it('should return updated token', async () => {
      const [userId, oldToken, newToken] = [uuidv4(), 'oldToken', 'newToken'];
      await tokenService.saveRefreshToken(oldToken, userId);
      const updToken = await tokenService.updateRefreshToken(
        userId,
        oldToken,
        newToken,
      );
      expect(updToken).toEqual(newToken);
    });
  });
});
