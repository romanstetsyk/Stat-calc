type DatasetEntityConstructor = {
  id: string;
  originalname: string;
  mimetype: string;
  size: number;
  buffer: Buffer;
  userId: string;
  createdAt: Date;
  updatedAt: Date;
};

class DatasetEntity {
  public id: string;
  public originalname: string;
  public mimetype: string;
  public size: number;
  public buffer: Buffer;
  public userId: string;
  public createdAt: Date;
  public updatedAt: Date;

  public constructor({
    id,
    originalname,
    mimetype,
    size,
    buffer,
    userId,
    createdAt,
    updatedAt,
  }: DatasetEntityConstructor) {
    this.id = id;
    this.originalname = originalname;
    this.mimetype = mimetype;
    this.size = size;
    this.buffer = buffer;
    this.userId = userId;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
  }
}

type DatasetBody = Omit<DatasetEntity, 'id' | 'createdAt' | 'updatedAt'>;

export type { DatasetBody };
export { DatasetEntity };
