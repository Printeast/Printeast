const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api/v1';

export interface ApiResponse<T = unknown> {
    success: boolean;
    data?: T;
    error?: string;
    message?: string;
}

export interface RegisterData {
    email: string;
    password: string;
    name: string;
    role?: 'CREATOR' | 'SELLER' | 'USER';
}

export interface LoginData {
    email: string;
    password: string;
}

export interface AuthResponse {
    user: {
        id: string;
        email: string;
        name: string;
        role: string;
    };
    token?: string;
}

class ApiService {
    private async fetchWithCredentials(
        endpoint: string,
        options: RequestInit = {}
    ): Promise<Response> {
        return fetch(`${API_BASE_URL}${endpoint}`, {
            ...options,
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json',
                ...options.headers,
            },
        });
    }

    async register(data: RegisterData): Promise<ApiResponse<AuthResponse>> {
        try {
            const response = await this.fetchWithCredentials('/auth/register', {
                method: 'POST',
                body: JSON.stringify(data),
            });

            const result = await response.json();

            if (!response.ok) {
                return {
                    success: false,
                    error: result.message || 'Registration failed',
                };
            }

            return {
                success: true,
                data: result.data,
            };
        } catch (error) {
            return {
                success: false,
                error: error instanceof Error ? error.message : 'Network error',
            };
        }
    }

    async login(data: LoginData): Promise<ApiResponse<AuthResponse>> {
        try {
            const response = await this.fetchWithCredentials('/auth/login', {
                method: 'POST',
                body: JSON.stringify(data),
            });

            const result = await response.json();

            if (!response.ok) {
                return {
                    success: false,
                    error: result.message || 'Login failed',
                };
            }

            return {
                success: true,
                data: result.data,
            };
        } catch (error) {
            return {
                success: false,
                error: error instanceof Error ? error.message : 'Network error',
            };
        }
    }

    async logout(): Promise<ApiResponse> {
        try {
            const response = await this.fetchWithCredentials('/auth/logout', {
                method: 'POST',
            });

            const result = await response.json();

            return {
                success: response.ok,
                message: result.message,
            };
        } catch (error) {
            return {
                success: false,
                error: error instanceof Error ? error.message : 'Network error',
            };
        }
    }

    async getSignedUrl(fileName: string, fileType: string): Promise<ApiResponse<{ signedUrl: string; fileUrl: string }>> {
        try {
            const response = await this.fetchWithCredentials('/storage/sign', {
                method: 'POST',
                body: JSON.stringify({ fileName, fileType }),
            });

            const result = await response.json();

            if (!response.ok) {
                return {
                    success: false,
                    error: result.message || 'Failed to get signed URL',
                };
            }

            return {
                success: true,
                data: result.data,
            };
        } catch (error) {
            return {
                success: false,
                error: error instanceof Error ? error.message : 'Network error',
            };
        }
    }
}

export const api = new ApiService();
