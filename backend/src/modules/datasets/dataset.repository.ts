import type { HydratedDocument } from 'mongoose';
import { MongooseError } from 'mongoose';
import {
  DATASET_VALIDATION_CONSTANTS,
  DATASET_VALIDATION_MESSAGES,
} from 'shared/build/index.js';
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
    const session = await this.datasetModel.startSession();
    let newDataset: HydratedDocument<DatasetDocument>;
    try {
      newDataset = await session.withTransaction(async () => {
        const { userId } = payload;
        const count = await this.datasetModel.countDocuments(
          { userId },
          { session },
        );
        if (count >= DATASET_VALIDATION_CONSTANTS.MAX_TOTAL_FILES) {
          throw new MongooseError(DATASET_VALIDATION_MESSAGES.MAX_TOTAL_FILES);
        }
        // Can't use this.datasetModel.create() with session option
        // https://mongoosejs.com/docs/api/model.html#Model.create()
        return await new this.datasetModel(payload).save({ session });
      });
    } finally {
      void session.endSession();
    }
    return new DatasetEntity(newDataset.toObject());
  }

  public async rename(
    payload: Pick<DatasetEntity, 'id' | 'displayName' | 'userId'>,
  ): Promise<DatasetEntity | null> {
    const { displayName, id: _id, userId } = payload;
    const renamedDataset: HydratedDocument<DatasetDocument> | null =
      await this.datasetModel.findOneAndUpdate(
        { _id, userId },
        { displayName },
        { new: true },
      );

    return renamedDataset ? new DatasetEntity(renamedDataset.toObject()) : null;
  }

  public async update(
    id: DatasetEntity['id'],
    payload: DatasetBody,
  ): Promise<DatasetEntity | null> {
    const _id = id;
    const updatedDataset: HydratedDocument<DatasetDocument> | null =
      await this.datasetModel.findOneAndUpdate(
        { _id, userId: payload.userId },
        { _id, ...payload },
        { new: true, upsert: true },
      );
    return updatedDataset ? new DatasetEntity(updatedDataset.toObject()) : null;
  }
}

export { DatasetRepository };
