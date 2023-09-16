import type { UserEntity } from './user.entity.js';

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
};
