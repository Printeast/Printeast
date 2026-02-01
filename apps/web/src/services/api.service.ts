import { ApiResponse } from "@repo/types";
import { createClient } from "@/utils/supabase/browser";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000/api/v1";

class ApiClient {
  private _supabase: any = null;

  public get supabase() {
    if (!this._supabase) {
      this._supabase = createClient();
    }
    return this._supabase;
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {},
  ): Promise<ApiResponse<T>> {
    try {
      const { data: { session } } = await this.supabase.auth.getSession();
      const token = session?.access_token;

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

      // Handle 204 No Content or 304 Not Modified (No body transitions)
      if (response.status === 204 || response.status === 304) {
        // We return success but null data, or we'd need a cache. 
        // For /auth/me, we really want the data, so we'll force no-cache if needed.
        return { success: true, data: null as any };
      }

      const contentType = response.headers.get("content-type");
      if (!contentType || !contentType.includes("application/json")) {
        if (!response.ok) throw new Error(`API Error: ${response.status}`);
        return { success: true, data: null as any };
      }

      const result: ApiResponse<T> = await response.json();

      if (!response.ok) {
        throw new Error(result.message || `API Error: ${response.status}`);
      }

      return result;
    } catch (error: unknown) {
      console.error(`[API Error] ${endpoint}:`, error);
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
    return this.request<T>(endpoint, {
      method: "GET",
      // Force reload for auth checks to avoid 304 empty body issues
      cache: endpoint.includes('auth') ? 'no-cache' : 'default'
    });
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
