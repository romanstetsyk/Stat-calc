import { TOKEN_TYPES } from '~/packages/token-util/token-util.js';
import type { TokenUtilBase } from '~/packages/token-util/token-util-base.package.js';

import type { TokenRepository } from './token.repository.js';
import type { TokenBody } from './types.js';

class TokenService {
  private tokenRepository: TokenRepository;
  private tokenUtil: TokenUtilBase;

  public constructor(
    tokenRepository: TokenRepository,
    tokenUtil: TokenUtilBase,
  ) {
    this.tokenRepository = tokenRepository;
    this.tokenUtil = tokenUtil;
  }

  public async saveRefreshToken(token: string, userId: string): Promise<void> {
    await this.tokenRepository.saveToken({
      token,
      userId,
      type: 'refresh',
      blacklisted: false,
    });
  }

  public generateTokens(userId: string): {
    accessToken: string;
    refreshToken: string;
  } {
    const accessToken = this.tokenUtil.issueJWT({
      id: userId,
      type: TOKEN_TYPES.ACCESS,
    });
    const refreshToken = this.tokenUtil.issueJWT({
      id: userId,
      type: TOKEN_TYPES.REFRESH,
    });

    return { accessToken, refreshToken };
  }

  public async deleteToken(payload: {
    token: string;
    userId: string;
  }): Promise<void> {
    await this.tokenRepository.delete(payload);
  }

  public async updateRefreshToken(
    userId: string,
    oldToken: string,
    newToken: string,
  ): Promise<string> {
    const oldTokenObject: TokenBody = {
      token: oldToken,
      userId,
      blacklisted: false,
      type: 'refresh',
    };
    const newTokenObject: TokenBody = {
      token: newToken,
      userId,
      blacklisted: false,
      type: 'refresh',
    };

    const tokenEntity = await this.tokenRepository.update(
      oldTokenObject,
      newTokenObject,
    );
    if (!tokenEntity) {
      throw new Error('refresh token not updated');
    }
    return tokenEntity.token;
  }
}

export { TokenService };
