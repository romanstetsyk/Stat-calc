import type { UserInfo } from 'shared/build/index.js';

import type { UserEntity } from './user.entity.js';

type UserReposirotyCreate = UserInfo & Pick<UserEntity, 'passwordHash'>;

type FindByIdRequestDTO = {
  id: UserEntity['id'];
};

type FindAllResponseDTO = ReturnType<UserEntity['toObject']>[];

type FindByIdResponseDTO = ReturnType<UserEntity['toObject']>;

type CreateResponseDTO = ReturnType<UserEntity['toObject']>;

export type {
  CreateResponseDTO,
  FindAllResponseDTO,
  FindByIdRequestDTO,
  FindByIdResponseDTO,
  UserReposirotyCreate,
};
