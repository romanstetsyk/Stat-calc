import type { UserService } from '~/users/user.service.js';

import type { SignUpRequestDTO, SignUpResponseDTO } from './types.js';

class AuthService {
  private userService: UserService;
  public constructor(userService: UserService) {
    this.userService = userService;
  }

  public async signUp(body: SignUpRequestDTO): Promise<SignUpResponseDTO> {
    const { name, email, password } = body;
    const user = await this.userService.create({
      name,
      email,
      passwordHash: password,
    });
    return {
      id: user.id,
      email: user.email,
      token: '42',
    };
  }
}

export { AuthService };
