
import { RequestData, ResponseData } from '../pages/Index';

export interface ApiRequestOptions {
  timeout?: number;
  retries?: number;
}

export class ApiError extends Error {
  public status: number;
  public statusText: string;
  public response?: Response;

  constructor(message: string, status: number, statusText: string, response?: Response) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.statusText = statusText;
    this.response = response;
  }
}

export const makeApiRequest = async (
  request: RequestData,
  options: ApiRequestOptions = {}
): Promise<ResponseData> => {
  const { timeout = 30000, retries = 0 } = options;
  const startTime = Date.now();

  // Create AbortController for timeout
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeout);

  try {
    // Build URL with query params
    const url = new URL(request.url);
    request.queryParams.forEach(param => {
      if (param.key && param.value) {
        url.searchParams.append(param.key, param.value);
      }
    });

    // Build headers
    const headers: Record<string, string> = {};
    request.headers.forEach(header => {
      if (header.key && header.value) {
        headers[header.key] = header.value;
      }
    });

    const requestOptions: RequestInit = {
      method: request.method,
      headers,
      signal: controller.signal
    };

    // Add body for non-GET requests
    if (request.method !== 'GET' && request.method !== 'HEAD' && request.body) {
      requestOptions.body = request.body;
    }

    console.log('Making API request:', {
      url: url.toString(),
      method: request.method,
      headers: headers
    });

    const fetchResponse = await fetch(url.toString(), requestOptions);
    clearTimeout(timeoutId);

    const time = Date.now() - startTime;
    
    // Get response text
    const responseText = await fetchResponse.text();
    
    // Parse response data
    let parsedData;
    try {
      parsedData = responseText ? JSON.parse(responseText) : null;
    } catch (parseError) {
      // If JSON parsing fails, return raw text
      parsedData = responseText;
    }

    // Get response headers
    const responseHeaders: Record<string, string> = {};
    fetchResponse.headers.forEach((value, key) => {
      responseHeaders[key] = value;
    });

    const responseData: ResponseData = {
      status: fetchResponse.status,
      statusText: fetchResponse.statusText,
      headers: responseHeaders,
      data: parsedData,
      time
    };

    // Check if response is successful
    if (!fetchResponse.ok) {
      responseData.error = `HTTP ${fetchResponse.status}: ${fetchResponse.statusText}`;
    }

    return responseData;

  } catch (error) {
    clearTimeout(timeoutId);
    const time = Date.now() - startTime;

    console.error('API request failed:', error);

    // Handle different types of errors
    if (error instanceof TypeError && error.message.includes('Failed to fetch')) {
      return {
        status: 0,
        statusText: 'Network Error',
        headers: {},
        data: null,
        time,
        error: 'Network error - check your internet connection or CORS policy'
      };
    }

    if (error.name === 'AbortError') {
      return {
        status: 0,
        statusText: 'Timeout',
        headers: {},
        data: null,
        time,
        error: `Request timed out after ${timeout}ms`
      };
    }

    // Generic error handling
    return {
      status: 0,
      statusText: 'Error',
      headers: {},
      data: null,
      time,
      error: error instanceof Error ? error.message : 'Unknown error occurred'
    };
  }
};
