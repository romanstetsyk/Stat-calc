import { ERROR_MESSAGES } from '~/common/constants/constants.js';
import type { UserEntity, UserService } from '~/modules/users/users.js';

import type { SignUpRequestDTO, SignUpResponseDTO } from './types.js';

class AuthService {
  private userService: UserService;
  public constructor(userService: UserService) {
    this.userService = userService;
  }

  public async signUp(payload: SignUpRequestDTO): Promise<SignUpResponseDTO> {
    const existingUser = await this.userService.findByEmail(payload.email);
    if (existingUser) {
      throw new Error(ERROR_MESSAGES.USER_ALREADY_EXIST);
    }

    const user: UserEntity = await this.userService.create(payload);
    return {
      id: user.id,
      email: user.email,
      token: '42',
    };
  }
}

export { AuthService };
