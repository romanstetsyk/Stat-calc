import type { DatasetEntity } from './dataset.entity.js';

type DatasetBody = Omit<
  DatasetEntity,
  'id' | 'createdAt' | 'updatedAt' | 'toObject'
>;

export type { DatasetBody };
