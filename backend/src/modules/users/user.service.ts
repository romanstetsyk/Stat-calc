import type { SignUpRequestDTO } from 'shared/build/index.js';

import type { Service } from '~/common/types/types.js';
import type { PasswordUtil } from '~/packages/password-util/password-util.js';

import { UserEntity } from './user.entity.js';
import type { UserRepository } from './user.repository.js';

class UserService implements Service<UserEntity> {
  private userRepository: UserRepository;
  private passwordUtil: PasswordUtil;

  public constructor(
    userRepository: UserRepository,
    passwordUtil: PasswordUtil,
  ) {
    this.userRepository = userRepository;
    this.passwordUtil = passwordUtil;
  }

  public async findAll(): Promise<UserEntity[]> {
    const users: UserEntity[] = await this.userRepository.findAll();
    return users;
  }

  public async findById(id: UserEntity['id']): Promise<UserEntity | null> {
    const user: UserEntity | null = await this.userRepository.findById(id);
    return user;
  }

  public async findByEmail(
    email: UserEntity['email'],
  ): Promise<UserEntity | null> {
    const user: UserEntity | null =
      await this.userRepository.findByEmail(email);

    return user;
  }

  public async create(payload: SignUpRequestDTO): Promise<UserEntity> {
    const { name, email, password } = payload;
    const passwordHash = await this.passwordUtil.hash(password);

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
