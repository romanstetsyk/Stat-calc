import type { Http, HttpOptions } from './types';

// Use fetch/axios wrapper
class HttpBase implements Http {
  public makeRequest(url: URL, options: HttpOptions): Promise<Response> {
    return fetch(url, options);
  }
}

export { HttpBase };
