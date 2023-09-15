import { ERROR_MESSAGES } from '~/constants/constants.js';
import { HTTP_CODES } from '~/constants/status-codes.js';
import { HttpError } from '~/exceptions/http-error.js';
import type { Service } from '~/types/types.js';

import type { CreateRequestDTO } from './types.js';
import type { UserEntity } from './user.entity.js';
import type { UserRepository } from './user.repository.js';

class UserService implements Service<UserEntity> {
  private userRepository: UserRepository;

  public constructor(userRepository: UserRepository) {
    this.userRepository = userRepository;
  }

  public async findAll(): Promise<UserEntity[]> {
    const users: UserEntity[] = await this.userRepository.findAll();
    return users;
  }

  public async findById(id: UserEntity['id']): Promise<UserEntity> {
    const user: UserEntity | null = await this.userRepository.findById(id);
    if (!user) {
      throw new HttpError({
        status: HTTP_CODES.NOT_FOUND,
        message: ERROR_MESSAGES.NOT_FOUND,
      });
    }
    return user;
  }

  public async create(body: CreateRequestDTO['body']): Promise<UserEntity> {
    const user: UserEntity = await this.userRepository.create(body);
    return user;
  }
}

export { UserService };
