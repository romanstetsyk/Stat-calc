import type { HydratedDocument } from 'mongoose';

import type { DatasetBody } from './dataset.entity.js';
import { DatasetEntity } from './dataset.entity.js';
import type { DatasetDocument, DatasetModel } from './dataset.model.js';

class DatasetRepository {
  private datasetModel: typeof DatasetModel;

  public constructor(datasetModel: typeof DatasetModel) {
    this.datasetModel = datasetModel;
  }

  public async findAll(): Promise<DatasetEntity[]> {
    const allDatasets: HydratedDocument<DatasetDocument>[] =
      await this.datasetModel.find({});
    return allDatasets.map((dataset) => new DatasetEntity(dataset.toObject()));
  }

  public async uploadOne(payload: DatasetBody): Promise<DatasetEntity> {
    const newDataset: HydratedDocument<DatasetDocument> =
      await this.datasetModel.create(payload);

    return new DatasetEntity(newDataset.toObject());
  }
}

export { DatasetRepository };
