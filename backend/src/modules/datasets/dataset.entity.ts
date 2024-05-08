import type { DatasetDTO } from 'shared/build/index.js';

import type { UserEntity } from '~/modules/users/users.js';

import type { DatasetFile } from './types.js';

type DatasetEntityConstructor = {
  id: string;
  name: string;
  ext: string;
  mimetype: string;
  size: number;
  buffer: Buffer;
  userId: UserEntity['id'];
  createdAt: Date;
  updatedAt: Date;
};

class DatasetEntity {
  public id: string;
  public name: string;
  public ext: string;
  public mimetype: string;
  public size: number;
  public buffer: Buffer;
  public userId: string;
  public createdAt: Date;
  public updatedAt: Date;

  public constructor({
    id,
    name,
    ext,
    mimetype,
    size,
    buffer,
    userId,
    createdAt,
    updatedAt,
  }: DatasetEntityConstructor) {
    this.id = id;
    this.name = name;
    this.ext = ext;
    this.mimetype = mimetype;
    this.size = size;
    this.buffer = buffer;
    this.userId = userId;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
  }

  public toObject(): DatasetDTO {
    const { id, name, ext, size, updatedAt } = this;
    const filename = name;
    return { id, filename, ext, size, updatedAt: updatedAt.toISOString() };
  }

  public toFile(): DatasetFile {
    const { id, name, ext, buffer, mimetype } = this;
    const bufferToSend = Buffer.from(buffer.buffer);
    const filename = name + ext;
    return { id, filename, buffer: bufferToSend, mimetype };
  }
}

export { DatasetEntity };
