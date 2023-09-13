import type { Repository } from '~/types/types.js';

import type { UserEntity } from './types.js';

class UserRepository implements Repository<UserEntity> {
  public findAll(): Promise<UserEntity[]> {
    const users: UserEntity[] = [{ id: '1' }, { id: '2' }];
    return Promise.resolve(users);
  }

  public findById(id: UserEntity['id']): Promise<UserEntity> {
    const user = { id };
    return Promise.resolve(user);
  }
}

export { UserRepository };
