import type {
  SignInRequestDTO,
  SignUpRequestDTO,
  UserInfo,
} from 'shared/build/index.js';
import { ERROR_MESSAGES } from 'shared/build/index.js';

import type { UserEntity, UserService } from '~/modules/users/users.js';
import type { PasswordUtil } from '~/packages/password-util/password-util.js';
import type {
  JWTPayload,
  TOKEN_TYPES,
} from '~/packages/token-util/token-util.js';
import type { TokenUtilBase } from '~/packages/token-util/token-util-base.package.js';

import type { TokenService } from '../tokens/tokens.js';
import type { Tokens, UserWithTokens } from './types.js';

type AuthServiceConstructor = {
  userService: UserService;
  tokenService: TokenService;
  passwordUtil: PasswordUtil;
  tokenUtil: TokenUtilBase;
};

class AuthService {
  private userService: UserService;
  private tokenService: TokenService;
  private passwordUtil: PasswordUtil;
  private tokenUtil: TokenUtilBase;

  public constructor({
    userService,
    tokenService,
    passwordUtil,
    tokenUtil,
  }: AuthServiceConstructor) {
    this.userService = userService;
    this.tokenService = tokenService;
    this.passwordUtil = passwordUtil;
    this.tokenUtil = tokenUtil;
  }

  public async deleteRefreshToken(token: string): Promise<void> {
    await this.tokenService.deleteToken({ token });
  }

  public async updateTokens(refreshTokenOld: string): Promise<Tokens> {
    const jwtPayload =
      this.tokenUtil.verifyJWT<typeof TOKEN_TYPES.REFRESH>(refreshTokenOld);

    const { accessToken, refreshToken } = this.tokenService.generateTokens(
      jwtPayload.id,
    );
    const savedRefreshToken = await this.tokenService.updateRefreshToken(
      jwtPayload.id,
      refreshTokenOld,
      refreshToken,
    );
    return { accessToken, refreshToken: savedRefreshToken };
  }

  public async getCurrentUser(accessToken: string): Promise<UserInfo | null> {
    const payloadAccess =
      this.tokenUtil.verifyJWT<typeof TOKEN_TYPES.ACCESS>(accessToken);

    const user = await this.userService.findById(payloadAccess.id);
    return user ? user.toObject() : user;
  }

  public isAuthenticated(token: string): boolean {
    try {
      this.tokenUtil.verifyJWT<typeof TOKEN_TYPES.ACCESS>(token);
      return true;
    } catch {
      return false;
    }
  }

  public ensureAuth(token: string): JWTPayload['id'] {
    try {
      const { id } = this.tokenUtil.verifyJWT<typeof TOKEN_TYPES.ACCESS>(token);
      return id;
    } catch {
      throw new Error('auth error');
    }
  }

  public async signIn(payload: SignInRequestDTO): Promise<UserWithTokens> {
    const { email, password } = payload;
    const user = await this.userService.findByEmail(email);
    if (!user) {
      throw new Error(ERROR_MESSAGES.USER_NOT_FOUND);
    }

    const pwMatch = await this.passwordUtil.compare(
      password,
      user.passwordHash,
    );
    if (!pwMatch) {
      throw new Error(ERROR_MESSAGES.PASSWORD_INCORRECT);
    }
    const { accessToken, refreshToken } = this.tokenService.generateTokens(
      user.id,
    );
    await this.tokenService.saveRefreshToken(refreshToken, user.id);

    return {
      userId: user.id,
      accessToken,
      refreshToken,
    };
  }

  public async signUp(payload: SignUpRequestDTO): Promise<UserWithTokens> {
    const existingUser = await this.userService.findByEmail(payload.email);
    if (existingUser) {
      throw new Error(ERROR_MESSAGES.USER_ALREADY_EXIST);
    }

    const user: UserEntity = await this.userService.create(payload);

    const { accessToken, refreshToken } = this.tokenService.generateTokens(
      user.id,
    );
    await this.tokenService.saveRefreshToken(refreshToken, user.id);

    return {
      userId: user.id,
      accessToken,
      refreshToken,
    };
  }
}

export { AuthService };
