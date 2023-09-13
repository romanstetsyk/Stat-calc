type UserEntity = {
  id: string;
};

type FindByIdRequestDTO = { params: { id: UserEntity['id'] } };
type FindAllResponseDTO = UserEntity[];
type FindByIdResponseDTO = UserEntity;

export type {
  FindAllResponseDTO,
  FindByIdRequestDTO,
  FindByIdResponseDTO,
  UserEntity,
};
