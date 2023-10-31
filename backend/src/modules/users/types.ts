import type { UserInfo } from 'shared/build/index.js';

import type { UserEntity } from './user.entity.js';

type UserReposirotyCreate = UserInfo & Pick<UserEntity, 'passwordHash'>;

type FindByIdRequestDTO = {
  id: UserEntity['id'];
};

type FindAllResponseDTO = UserEntity[];

type FindByIdResponseDTO = UserEntity;

type CreateResponseDTO = UserEntity;

export type {
  CreateResponseDTO,
  FindAllResponseDTO,
  FindByIdRequestDTO,
  FindByIdResponseDTO,
  UserReposirotyCreate,
};
