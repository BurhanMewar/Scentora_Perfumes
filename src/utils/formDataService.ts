import { API_BASE_URL } from "../constants/apiConstants";
interface FormDataRequestOptions {
  method: "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
  headers?: Record<string, string>;
  body?: any;
  params?: Record<string, string>;
}

class FormDataService {
  private baseUrl: string;

  constructor() {
    this.baseUrl = "/api/form";
  }

  async request(endpoint: string, options: FormDataRequestOptions) {
    try {
      const formData = new FormData();
      
      formData.append("url", `${API_BASE_URL}${endpoint}`);
      formData.append("method", options.method);
      if (options.headers) {
        formData.append("headers", JSON.stringify(options.headers));
      }
      if (options.body instanceof FormData) {
        // If body is already FormData, append each entry
        for (const [key, value] of options.body.entries()) {
          
          if (value instanceof File) {
            
            // Convert File to Blob (optional: preserve original type)
            const blob = new Blob([value], { type: value.type });
            formData.append(key, blob, value.name); // append with original filename
          } else {
            // Append other values normally
            formData.append(key, value);
          }
        }
      }
      
      const response = await fetch(this.baseUrl, {
        method: "POST",
        body: formData,
        credentials: "include", // Include cookies in the request
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error("FormData response error:", errorText);
        throw new Error(
          `HTTP error! status: ${response.status}, body: ${errorText}`
        );
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error("FormData service error:", error);
      throw error;
    }
  }

  // Convenience methods for different HTTP verbs
  async post(endpoint: string, body?: any, headers?: Record<string, string>) {
   
    return this.request(endpoint, {
      method: "POST",
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
}

// Create and export a singleton instance
export const formDataService = new FormDataService();
export default formDataService;
