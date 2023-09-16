import { validate as validateUUID } from 'uuid';

import type { SignUpRequestDTO } from '~/auth/types.js';
import { ERROR_MESSAGES, HTTP_CODES } from '~/constants/constants.js';
import type { Encrypt } from '~/encrypt/encrypt.js';
import { HttpError } from '~/exceptions/exceptions.js';
import type { Service } from '~/types/types.js';

import { UserEntity } from './user.entity.js';
import type { UserRepository } from './user.repository.js';

class UserService implements Service<UserEntity> {
  private userRepository: UserRepository;
  private encrypt: Encrypt;

  public constructor(userRepository: UserRepository, encrypt: Encrypt) {
    this.userRepository = userRepository;
    this.encrypt = encrypt;
  }

  public async findAll(): Promise<UserEntity[]> {
    const users: UserEntity[] = await this.userRepository.findAll();
    return users;
  }

  public async findById(id: UserEntity['id']): Promise<UserEntity> {
    if (!validateUUID(id)) {
      throw new HttpError({
        status: HTTP_CODES.NOT_FOUND,
        message: ERROR_MESSAGES.NOT_FOUND,
      });
    }

    const user: UserEntity | null = await this.userRepository.findById(id);

    if (!user) {
      throw new HttpError({
        status: HTTP_CODES.NOT_FOUND,
        message: ERROR_MESSAGES.NOT_FOUND,
      });
    }
    return user;
  }

  public async create(payload: SignUpRequestDTO): Promise<UserEntity> {
    const { name, email, password } = payload;
    const passwordHash = await this.encrypt.hashString(password);

    const userObjWithoutID = UserEntity.createObject({
      name,
      email,
      passwordHash,
    });

    const user: UserEntity = await this.userRepository.create(userObjWithoutID);
    return user;
  }
}

export { UserService };
