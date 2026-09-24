import { API_BASE_URL } from '../constants/apiConstants';

interface ProxyRequestOptions {
  method: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
  headers?: Record<string, string>;
  body?: any;
  params?: Record<string, string>;
}

class ProxyService {
  private baseUrl: string;

  constructor() {
    this.baseUrl = '/api/proxy';
  }

  async request(endpoint: string, options: ProxyRequestOptions) {
    try {
      const fullUrl = `${API_BASE_URL}${endpoint}`;
      
      // Prepare the request data
      const requestData = {
        url: fullUrl,
        method: options.method,
        headers: options.headers || {},
        body: options.body,
        params: options.params,
      };

      // Make request to our API proxy route which will handle cookies server-side
      const response = await fetch(this.baseUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestData),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        
        // Check if we need to redirect to login
        if (errorData.redirectToLogin) {
          // Redirect to login page immediately using current URL
          if (typeof window !== 'undefined') {
            // Use current URL's origin to redirect to login page
            const currentOrigin = window.location.origin;
            window.location.href = `${currentOrigin}/auth/login`;
            return; // Exit immediately to prevent error from being thrown
          }
        }
        
        throw new Error(`HTTP error! status: ${response.status}, message: ${errorData.message || 'Unknown error'}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      throw error;
    }
  }

  // Convenience methods for different HTTP verbs
  async get(endpoint: string, params?: Record<string, string>) {
    return this.request(endpoint, {
      method: 'GET',
      params,
    });
  }

  async post(endpoint: string, body?: any, headers?: Record<string, string>) {
    return this.request(endpoint, {
      method: 'POST',
      body,
      headers,
    });
  }

  async put(endpoint: string, body?: any, headers?: Record<string, string>) {
    return this.request(endpoint, {
      method: 'PUT',
      body,
      headers,
    });
  }

  async patch(endpoint: string, body?: any, headers?: Record<string, string>) {
    return this.request(endpoint, {
      method: 'PATCH',
      body,
      headers,
    });
  }

  async delete(endpoint: string, params?: Record<string, string>, headers?: any) {
    return this.request(endpoint, {
      method: 'DELETE',
      params,
      headers,
    });
  }
}

// Create and export a singleton instance
export const proxyService = new ProxyService();
export default proxyService;
