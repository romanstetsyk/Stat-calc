import { ERROR_MESSAGES } from '~/common/constants/constants.js';
import type { UserEntity, UserService } from '~/modules/users/users.js';
import type { PasswordUtil } from '~/packages/password-util/password-util.js';
import type { TokenUtilBase } from '~/packages/token-util/token-util-base.package.js';
import type { JWTPayload } from '~/packages/token-util/types.js';

import type { TokenService } from '../tokens/tokens.js';
import type {
  SignInRequestDTO,
  SignUpRequestDTO,
  UserWithTokens,
} from './types.js';

class AuthService {
  private userService: UserService;
  private tokenService: TokenService;
  private passwordUtil: PasswordUtil;
  private tokenUtil: TokenUtilBase;

  public constructor(
    userService: UserService,
    tokenService: TokenService,
    passwordUtil: PasswordUtil,
    tokenUtil: TokenUtilBase,
  ) {
    this.userService = userService;
    this.tokenService = tokenService;
    this.passwordUtil = passwordUtil;
    this.tokenUtil = tokenUtil;
  }

  public async deleteRefreshToken(
    token: string,
    userId: string,
  ): Promise<void> {
    await this.tokenService.deleteToken({ token, userId });
  }

  public verifyAccessToken(headers: {
    authorization?: string;
  }): JWTPayload<'access'> {
    const AUTH_HEADER = 'authorization';
    const AUTH_SCHEMA = 'bearer';

    if (!headers[AUTH_HEADER]) {
      throw new Error('No authorization header');
    }

    const [schema, token] = headers.authorization.split(' ');
    if (schema.toLowerCase() !== AUTH_SCHEMA) {
      throw new Error('Schema is not `bearer`');
    }

    if (!token) {
      throw new Error('Token missing in authorization string');
    }

    return this.tokenUtil.verifyJWT<'access'>(token);
  }

  public isAuthenticated(headers: { authorization?: string }): boolean {
    try {
      this.verifyAccessToken(headers);
      return true;
    } catch {
      return false;
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
      id: user.id,
      email: user.email,
      accessToken,
      refreshToken,
    };
  }

  public async signUp(payload: SignUpRequestDTO): Promise<UserEntity> {
    const existingUser = await this.userService.findByEmail(payload.email);
    if (existingUser) {
      throw new Error(ERROR_MESSAGES.USER_ALREADY_EXIST);
    }

    const user: UserEntity = await this.userService.create(payload);

    return user;
  }
}

export { AuthService };
