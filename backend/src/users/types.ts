type UserEntity = {
  id: string;
};

type FindByIdRequestDTO = { params: { id: string } };
type FindAllResponseDTO = UserEntity[];
type FindByIdResponseDTO = UserEntity;

export type {
  FindAllResponseDTO,
  FindByIdRequestDTO,
  FindByIdResponseDTO,
  UserEntity,
};
