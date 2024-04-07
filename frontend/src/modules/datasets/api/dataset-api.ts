import type {
  DatasetDeleteResponseDTO,
  DatasetDeleteURLParams,
  DatasetFindAllResponseDTO,
  DatasetFindOneRepsonseDTO,
  DatasetFindOneURLParams,
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

import { getFilenameFromHeaders } from '../helpers';

declare global {
  // eslint-disable-next-line @typescript-eslint/consistent-type-definitions
  interface WindowEventMap {
    'fetch-progress': CustomEvent<{
      received: number;
      length: number;
      done: boolean;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      options: any;
    }>;
  }
}

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

  public async findOne(
    params: DatasetFindOneURLParams,
    signal?: RequestInit['signal'],
  ): Promise<DatasetFindOneRepsonseDTO> {
    const res = await this.load({
      url: this.constructURL(API_PATHS_DATASETS.$ID, { params }),
      options: {
        method: HTTP_METHODS.GET,
        hasAuth: true,
        signal,
      },
    });
    const filename = getFilenameFromHeaders(res.headers);
    return { filename, buffer: await this.arrayBuffer(res, params) };
  }

  private async arrayBuffer(
    response: Response,
    options?: Record<string, unknown>,
  ): Promise<Uint8Array> {
    let loading = true;

    if (!response.body) {
      throw new Error('Response body is empty');
    }
    const reader = response.body.getReader();
    const contentLength = response.headers.get('content-length');
    if (!contentLength) {
      throw new Error('Content length header is missing');
    }
    const length = +contentLength;
    let received = 0;
    const chunks: Uint8Array[] = [];

    while (loading) {
      const { done, value } = await reader.read();
      if (done) {
        loading = false;
      } else {
        chunks.push(value);
        received += value.length;
      }
      const payload = { detail: { received, length, done, options } };
      const onProgress = new CustomEvent('fetch-progress', payload);
      window.dispatchEvent(onProgress);
    }

    const chunksAll = new Uint8Array(received);
    let position = 0;
    for (const chunk of chunks) {
      chunksAll.set(chunk, position);
      position += chunk.length;
    }
    return chunksAll;
  }
}

export { DatasetApi };
