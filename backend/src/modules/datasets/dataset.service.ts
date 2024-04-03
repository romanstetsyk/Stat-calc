import type { DatasetDTO } from 'shared/build/index.js';

import type { DatasetEntity } from './dataset.entity.js';
import type { DatasetRepository } from './dataset.repository.js';
import type { DatasetBody, DatasetFile } from './types.js';

type DatasetServiceConstructor = {
  datasetRepository: DatasetRepository;
};

class DatasetService {
  private datasetRepository: DatasetRepository;

  public constructor({ datasetRepository }: DatasetServiceConstructor) {
    this.datasetRepository = datasetRepository;
  }

  public async uploadOne(payload: DatasetBody): Promise<DatasetDTO> {
    const uploadedFile = await this.datasetRepository.uploadOne(payload);
    return uploadedFile.toObject();
  }

  public async findAll(userId: DatasetEntity['userId']): Promise<DatasetDTO[]> {
    const allDatasets: DatasetEntity[] =
      await this.datasetRepository.findAll(userId);
    return allDatasets.map((dataset) => dataset.toObject());
  }

  public async delete(payload: {
    id: DatasetEntity['id'];
    userId: DatasetEntity['userId'];
  }): Promise<DatasetDTO | null> {
    const deletedDataset = await this.datasetRepository.delete(payload);
    return deletedDataset ? deletedDataset.toObject() : null;
  }

  public async downloadOne(payload: {
    id: DatasetEntity['id'];
    userId: DatasetEntity['userId'];
  }): Promise<DatasetFile | null> {
    const dataset = await this.datasetRepository.findOne(payload);
    return dataset ? dataset.toFile() : null;
  }
}

export { DatasetService };
