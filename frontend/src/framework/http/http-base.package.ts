import type { Http, HttpOptions } from './types';

// Use fetch/axios wrapper
class HttpBase implements Http {
  public makeRequest(url: URL, options: HttpOptions): Promise<Response> {
    const { method, payload, headers, credentials } = options;
    return fetch(url, {
      credentials,
      method,
      headers,
      body: payload,
    });
  }
}

export { HttpBase };
