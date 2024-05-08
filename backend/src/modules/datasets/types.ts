import type { DatasetEntity } from './dataset.entity.js';

type DatasetBody = Omit<
  DatasetEntity,
  'id' | 'createdAt' | 'updatedAt' | 'toObject' | 'toFile'
>;

type DatasetFile = {
  id: DatasetEntity['id'];
  filename: DatasetEntity['name'];
  buffer: DatasetEntity['buffer'];
  mimetype: DatasetEntity['mimetype'];
};

export type { DatasetBody, DatasetFile };
