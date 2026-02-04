import { ApiResponse } from "@repo/types";
import { createClient } from "@/utils/supabase/browser";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000/api/v1";

class ApiClient {
  private supabase = createClient();

  private async request<T>(
    endpoint: string,
    options: RequestInit = {},
  ): Promise<ApiResponse<T>> {
    try {
      // Get the latest session token from Supabase
      const { data: { session } } = await this.supabase.auth.getSession();
      const token = session?.access_token;

      if (!token && typeof window !== "undefined") {
        console.warn(`[API Client] No session token found for: ${endpoint}`);
      }

      const headers: Record<string, string> = {
        "Content-Type": "application/json",
        ...options.headers as Record<string, string>,
      };

      if (token) {
        headers["Authorization"] = `Bearer ${token}`;
      }

      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        ...options,
        headers,
      });


      // Handle 204 No Content
      if (response.status === 204) {
        return { success: true, data: null as T };
      }

      const text = await response.text();
      let result: ApiResponse<T>;
      try {
        result = text
          ? (JSON.parse(text) as ApiResponse<T>)
          : { success: response.ok, data: null as T };
      } catch (parseError) {
        console.error(`[API Client Error] Invalid JSON from ${endpoint}:`, parseError);
        result = {
          success: false,
          error: "INVALID_JSON",
          message: "Invalid JSON response",
        } as ApiResponse<T>;
      }

      if (!response.ok) {
        throw new Error(result.message || `API Error: ${response.status}`);
      }

      return result;
    } catch (error: unknown) {
      console.error(`[API Client Error] ${endpoint}:`, error);
      const errorMessage =
        error instanceof Error ? error.message : "Unknown error occurred";
      return {
        success: false,
        error: "CONNECTION_ERROR",
        message: errorMessage,
      };
    }
  }

  get<T>(endpoint: string) {
    return this.request<T>(endpoint, { method: "GET" });
  }

  post<T>(endpoint: string, body: unknown) {
    return this.request<T>(endpoint, {
      method: "POST",
      body: JSON.stringify(body),
    });
  }

  put<T>(endpoint: string, body: unknown) {
    return this.request<T>(endpoint, {
      method: "PUT",
      body: JSON.stringify(body),
    });
  }

  delete<T>(endpoint: string) {
    return this.request<T>(endpoint, { method: "DELETE" });
  }
}

export const api = new ApiClient();
