import type { Repository, Service } from '~/types/types.js';

import type { UserEntity } from './types.js';

class UserService implements Service<UserEntity> {
  private userRepository: Repository<UserEntity>;

  public constructor(userRepository: Repository<UserEntity>) {
    this.userRepository = userRepository;
  }

  public async findAll(): Promise<UserEntity[]> {
    const users: UserEntity[] = await this.userRepository.findAll();
    return users;
  }

  public async findById(id: UserEntity['id']): Promise<UserEntity> {
    const user: UserEntity = await this.userRepository.findById(id);
    return await Promise.resolve(user);
  }
}

export { UserService };
