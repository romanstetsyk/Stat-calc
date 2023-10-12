import type { HydratedDocument } from 'mongoose';

import type { Repository } from '~/common/types/types.js';

import type { UserReposirotyCreate } from './types.js';
import { UserEntity } from './user.entity.js';
import type { UserDocument, UserModel } from './user.model.js';

class UserRepository implements Repository<UserEntity> {
  private userModel: typeof UserModel;

  public constructor(userModel: typeof UserModel) {
    this.userModel = userModel;
  }

  public async findAll(): Promise<UserEntity[]> {
    const allUsers: HydratedDocument<UserDocument>[] =
      await this.userModel.find({});

    return allUsers.map((user) => new UserEntity(user.toObject()));
  }

  public async findById(id: UserEntity['id']): Promise<UserEntity | null> {
    const user: HydratedDocument<UserDocument> | null =
      await this.userModel.findById(id);

    return user ? new UserEntity(user.toObject()) : null;
  }

  public async findByEmail(
    email: UserEntity['email'],
  ): Promise<UserEntity | null> {
    const user: HydratedDocument<UserDocument> | null =
      await this.userModel.findOne({ email });

    return user ? new UserEntity(user.toObject()) : null;
  }

  public async create(payload: UserReposirotyCreate): Promise<UserEntity> {
    const newUser: HydratedDocument<UserDocument> =
      await this.userModel.create(payload);

    return new UserEntity(newUser.toObject());
  }
}

export { UserRepository };
