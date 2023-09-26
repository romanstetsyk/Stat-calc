import type { Http, HttpOptions } from './types';

// Use fetch/axios wrapper
class HttpBase implements Http {
  public makeRequest(url: URL, options: HttpOptions): Promise<Response> {
    const { method, payload, headers } = options;
    return fetch(url, {
      method,
      headers,
      body: payload,
    });
  }
}

export { HttpBase };
