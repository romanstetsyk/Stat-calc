import type { UserService } from '~/users/users.js';

import type { SignUpRequestDTO, SignUpResponseDTO } from './types.js';

class AuthService {
  private userService: UserService;
  public constructor(userService: UserService) {
    this.userService = userService;
  }

  public async signUp(payload: SignUpRequestDTO): Promise<SignUpResponseDTO> {
    const user = await this.userService.create(payload);
    return {
      id: user.id,
      email: user.email,
      token: '42',
    };
  }
}

export { AuthService };
