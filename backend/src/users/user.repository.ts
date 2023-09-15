import type { HydratedDocument } from 'mongoose';
import { Error as MongooseError } from 'mongoose';

import { ERROR_MESSAGES } from '~/constants/error-messages.js';
import { HTTP_CODES } from '~/constants/status-codes.js';
import { HttpError } from '~/exceptions/http-error.js';
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
    const allUsers: HydratedDocument<UserDocument>[] =
      await this.userModel.find({});

    return allUsers.map((user) => new UserEntity(user.toObject()));
  }

  public async findById(id: UserEntity['id']): Promise<UserEntity | null> {
    let user: HydratedDocument<UserDocument> | null;

    try {
      user = await this.userModel.findById(id);
    } catch (error) {
      if (error instanceof MongooseError.CastError) {
        user = null;
      } else {
        throw new HttpError({
          status: HTTP_CODES.INTERNAL_SERVER_ERROR,
          message: ERROR_MESSAGES.UNKNOWN,
          cause: error,
        });
      }
    }

    return user ? new UserEntity(user.toObject()) : null;
  }

  public async create(body: CreateRequestDTO['body']): Promise<UserEntity> {
    const newUser: HydratedDocument<UserDocument> =
      await this.userModel.create(body);

    return new UserEntity(newUser.toObject());
  }
}

export { UserRepository };
