import type { Repository } from '~/types/types.js';

import type { CreateRequestDTO } from './types.js';
import { UserEntity } from './user.entity.js';
import type { UserDocument, UserModel } from './user.model.js';

class UserRepository implements Repository<UserEntity> {
  private userModel: typeof UserModel;

  public constructor(userModel: typeof UserModel) {
    this.userModel = userModel;
  }

  public async findAll(): Promise<UserEntity[]> {
    const users = await this.userModel.find<UserDocument>({});

    // const n = await this.userModel.create({ name: 'test' });
    // console.log(n);

    return users.map((user) => {
      const { _id, name } = user;
      const id = _id.toString();
      return new UserEntity({ id, name });
    });
  }

  public findById(id: UserEntity['id']): Promise<UserEntity> {
    const user = { id, name: 'iii' };
    return Promise.resolve(user);
  }

  public async create(body: CreateRequestDTO['body']): Promise<UserEntity> {
    const newUser = await this.userModel.create(body);
    const { _id, name } = newUser;
    const id = _id.toString();
    return new UserEntity({ id, name });
  }
}

export { UserRepository };
