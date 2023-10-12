import type {
  ErrorCommon,
  HTTP_CODES,
  ValueOf,
} from '@shared/build/esm/index.js';
import { HttpError } from '@shared/build/esm/index.js';

// import { HttpError } from 'shared/build/esm';
import type { HttpBase, HttpOptions } from '~/framework/http';

abstract class ApiBase {
  private baseUrl: string;
  private prefix: string;
  private http: HttpBase;

  protected constructor({
    baseUrl,
    prefix,
    http,
  }: {
    baseUrl: string;
    prefix: string;
    http: HttpBase;
  }) {
    this.baseUrl = baseUrl;
    this.prefix = prefix;
    this.http = http;
  }

  public async load(url: URL, options: HttpOptions): Promise<Response> {
    const res = await this.http.makeRequest(url, options);
    if (!res.ok) {
      await this.handleError(res);
    }
    return res;
  }

  private async handleError(res: Response): Promise<never> {
    const { message }: ErrorCommon = await res.json();
    const status = res.status as ValueOf<typeof HTTP_CODES>;
    throw new HttpError({ message, status, cause: res });
  }

  protected constructURL(path: string): URL {
    return new URL([this.prefix, path].join(''), this.baseUrl);
  }
}

export { ApiBase };
