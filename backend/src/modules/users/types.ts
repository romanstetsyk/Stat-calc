import type { UserEntity } from './user.entity.js';

type UserInfo = Pick<UserEntity, 'name' | 'email'>;

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
  UserInfo,
  UserReposirotyCreate,
};
