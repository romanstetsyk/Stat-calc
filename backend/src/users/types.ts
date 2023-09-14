import type { UserEntity } from './user.entity.js';

type FindByIdRequestDTO = { params: { id: UserEntity['id'] } };
type FindAllResponseDTO = UserEntity[];
type FindByIdResponseDTO = UserEntity;
type CreateRequestDTO = { body: { name: UserEntity['name'] } };
type CreateResponseDTO = UserEntity;

export type {
  CreateRequestDTO,
  CreateResponseDTO,
  FindAllResponseDTO,
  FindByIdRequestDTO,
  FindByIdResponseDTO,
};
