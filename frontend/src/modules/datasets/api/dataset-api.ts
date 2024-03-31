import type {
  DatasetDeleteResponseDTO,
  DatasetDeleteURLParams,
  DatasetFindAllResponseDTO,
  DatasetUploadRequestDTO,
  DatasetUploadResponseDTO,
} from '@shared/build/esm/index';
import {
  ACCEPT,
  API_PATHS_DATASETS,
  CONTENT_TYPE,
  HTTP_METHODS,
} from '@shared/build/esm/index';

import type { ApiBaseConstructor, Interceptors } from '~/framework/api';
import { ApiBase } from '~/framework/api';

type DatasetApiConstructor = ApiBaseConstructor & {
  interceptors: Interceptors;
};

class DatasetApi extends ApiBase {
  public constructor({
    baseUrl,
    prefix,
    http,
    storage,
    interceptors,
  }: DatasetApiConstructor) {
    super({ baseUrl, prefix, http, storage });

    this.interceptors = interceptors;
  }

  public async upload(
    payload: DatasetUploadRequestDTO,
  ): Promise<DatasetUploadResponseDTO> {
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

  public async findAll(
    signal?: RequestInit['signal'],
  ): Promise<DatasetFindAllResponseDTO> {
    const res = await this.load({
      url: this.constructURL(API_PATHS_DATASETS.ROOT),
      options: {
        method: HTTP_METHODS.GET,
        hasAuth: true,
        signal,
      },
    });
    return res.json();
  }

  public async delete(
    params: DatasetDeleteURLParams,
  ): Promise<DatasetDeleteResponseDTO> {
    const res = await this.load({
      url: this.constructURL(API_PATHS_DATASETS.$ID, { params }),
      options: {
        method: HTTP_METHODS.DELETE,
        hasAuth: true,
        headers: {
          accept: ACCEPT.JSON,
          contentType: CONTENT_TYPE.JSON,
        },
      },
    });
    return res.json();
  }
}

export { DatasetApi };
