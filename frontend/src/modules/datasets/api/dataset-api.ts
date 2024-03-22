import type { DatasetUploadRequestDTO } from '@shared/build/esm/index';
import { API_PATHS_DATASETS, HTTP_METHODS } from '@shared/build/esm/index';

import { ApiBase } from '~/framework/api';
import type { HttpBase } from '~/framework/http';
import type { Storage } from '~/framework/storage';

type Constructor = {
  baseUrl: string;
  prefix: string[];
  http: HttpBase;
  storage: Storage;
};

class DatasetApi extends ApiBase {
  public constructor({ baseUrl, prefix, http, storage }: Constructor) {
    super({ baseUrl, prefix, http, storage });
  }

  public async upload(payload: DatasetUploadRequestDTO): Promise<string> {
    // Get fieldName from the payload to not hardcode it in `formData.set(...)`
    const [[fieldName, [file]]] = Object.entries(payload);
    const formData = new FormData();
    formData.set(fieldName, file);

    const res = await this.load({
      url: this.constructURL(API_PATHS_DATASETS.UPLOAD),
      options: {
        method: HTTP_METHODS.POST,
        payload: formData,
        hasAuth: true,
      },
    });

    return res.json();
  }

  public async findAllDatasets(
    signal?: RequestInit['signal'],
  ): Promise<string[]> {
    const res = await this.load({
      url: this.constructURL('/all'),
      options: {
        method: 'get',
        hasAuth: true,
        signal,
      },
    });
    return res.json();
  }
}

export { DatasetApi };
