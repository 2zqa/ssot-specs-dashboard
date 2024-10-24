interface RequestOptions {
  /** The URL to the resource, e.g. an API endpoint. */
  url: string;
  /** The HTTP request method. */
  method: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'OPTIONS' | 'DELETE' | 'HEAD';
  /** Additional request headers. */
  headers?: HeadersInit;
  /** The JSON object to send with the request. */
  payload?: object;
  /** Force JSON parsing, even when the content-type header is not set to application/json. */
  shouldParseJson?: boolean;
}

export interface ResponseObject<T = unknown> {
  /** The HTTP status code, e.g. 200. */
  status: number;
  /** The HTTP status text, e.g. 'OK'. */
  statusText: string;
  /** The response data. */
  data: T;
  /** The response headers. */
  headers: Headers;
}

/**
 * Wrapper function around fetch so we can have common logic here for every API request.
 * Request failure (handling promise.catch) should be handled where the request is called.
 *
 * @example
 * const res = request({
 *  url: '/todo-items',
 *  method: 'GET'
 * }) as Promise<ResponseObject<TodoItem>>
 *
 * // 'data' is the actual data returned by the API.
 * const { data, status, statusText } = await res;
 */
export async function request({
  url,
  method,
  headers,
  payload,
  shouldParseJson,
}: RequestOptions): Promise<ResponseObject> {
  const fetchHeaders = new Headers(headers);

  // In case of a POST/PUT/PATCH request we send the given data (payload) as JSON.
  let body: string | undefined;

  if (payload) {
    body = JSON.stringify(payload);
    fetchHeaders.set('Content-Type', 'application/json');
  }

  const fetchOptions: RequestInit = {
    headers: fetchHeaders,
    method,
    body,
  };

  return await fetch(url, fetchOptions).then(async (res) => {
    const { status, statusText, headers } = res;

    switch (status) {
      // Resolve these specific status codes with the fetched data.
      case 200:
      case 201:
        // If there is no JSON content-type header, we can't parse the response body using .json()
        // otherwise it will freeze.
        if (shouldParseJson || headers.get('content-type') === 'application/json') {
          return await res.json().then((data) => ({ status, statusText, data, headers }));
        } else {
          return await Promise.resolve({ status, statusText, data: null, headers });
        }

      // 204 is "No content" so return no data.
      case 204:
        return await Promise.resolve({ status, statusText, data: null, headers });

      // Reject all other status codes like 401, 403, 403, etc.
      default:
        return await Promise.reject({ status, statusText, headers });
    }
  });
}
