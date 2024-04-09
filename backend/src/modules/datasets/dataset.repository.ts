import type { HydratedDocument } from 'mongoose';
import { MongooseError } from 'mongoose';
import { validate } from 'uuid';

import { INTERNAL_ERROR_MESSAGES } from '~/common/constants/constants.js';

import { DatasetEntity } from './dataset.entity.js';
import type { DatasetDocument, DatasetModel } from './dataset.model.js';
import type { DatasetBody } from './types.js';

class DatasetRepository {
  private datasetModel: typeof DatasetModel;

  public constructor(datasetModel: typeof DatasetModel) {
    this.datasetModel = datasetModel;
  }

  public async findAll(
    userId: DatasetEntity['userId'],
  ): Promise<DatasetEntity[]> {
    const allDatasets: HydratedDocument<DatasetDocument>[] =
      await this.datasetModel.find({ userId });
    return allDatasets.map((dataset) => new DatasetEntity(dataset.toObject()));
  }

  public async delete(payload: {
    id: DatasetEntity['id'];
    userId: DatasetEntity['userId'];
  }): Promise<DatasetEntity | null> {
    const { id: _id, userId } = payload;
    const deletedDataset: HydratedDocument<DatasetDocument> | null =
      await this.datasetModel.findOneAndDelete({ _id, userId });
    return deletedDataset ? new DatasetEntity(deletedDataset.toObject()) : null;
  }

  public async findOne(payload: {
    id: DatasetEntity['id'];
    userId: DatasetEntity['userId'];
  }): Promise<DatasetEntity | null> {
    const { id: _id, userId } = payload;
    const isValidUUID = validate(_id);
    if (!isValidUUID) {
      throw new MongooseError(INTERNAL_ERROR_MESSAGES.INVALID_UUID);
    }
    const dataset: HydratedDocument<DatasetDocument> | null =
      await this.datasetModel.findOne({ _id, userId });
    return dataset ? new DatasetEntity(dataset.toObject()) : null;
  }

  public async uploadOne(payload: DatasetBody): Promise<DatasetEntity> {
    const newDataset: HydratedDocument<DatasetDocument> =
      await this.datasetModel.create(payload);

    return new DatasetEntity(newDataset.toObject());
  }

  public async rename(
    payload: Pick<DatasetEntity, 'id' | 'originalname' | 'userId'>,
  ): Promise<DatasetEntity | null> {
    const { originalname, id: _id, userId } = payload;
    const renamedDataset: HydratedDocument<DatasetDocument> | null =
      await this.datasetModel.findOneAndUpdate(
        { _id, userId },
        { originalname },
        { new: true },
      );

    return renamedDataset ? new DatasetEntity(renamedDataset.toObject()) : null;
  }
}

export { DatasetRepository };
