import type { DatasetBody, DatasetEntity } from './dataset.entity.js';
import type { DatasetRepository } from './dataset.repository.js';

type DatasetServiceConstructor = {
  datasetRepository: DatasetRepository;
};

class DatasetService {
  private datasetRepository: DatasetRepository;

  public constructor({ datasetRepository }: DatasetServiceConstructor) {
    this.datasetRepository = datasetRepository;
  }

  public async uploadOne(
    payload: DatasetBody,
  ): Promise<DatasetEntity['originalname']> {
    const uploadedFile = await this.datasetRepository.uploadOne(payload);
    return uploadedFile.originalname;
  }

  public async findAll(): Promise<DatasetEntity[]> {
    const allDatasets: DatasetEntity[] = await this.datasetRepository.findAll();
    return allDatasets;
  }
}

export { DatasetService };
