import { createClient } from "@/utils/supabase/browser";
import type { AuthError, User, Session } from "@supabase/supabase-js";
import { getAuthCallbackUrl, getPasswordResetUrl } from "@/utils/env";

export interface AuthResponse {
    success: boolean;
    message?: string;
    user?: User;
    session?: Session | null;
    error?: AuthError;
}

export interface SignUpData {
    email: string;
    password: string;
    fullName?: string;
}

export interface SignInData {
    email: string;
    password: string;
}

/**
 * Robust Authentication Service using Supabase
 * Handles all auth operations with proper error handling and validation
 */
export class AuthService {
    private static supabase = createClient();

    /**
     * Sign up a new user with email and password
     */
    static async signUp(data: SignUpData): Promise<AuthResponse> {
        try {
            const { email, password, fullName } = data;

            // Validate input
            if (!email || !password) {
                return {
                    success: false,
                    message: "Email and password are required",
                };
            }

            if (password.length < 8) {
                return {
                    success: false,
                    message: "Password must be at least 8 characters long",
                };
            }

            // Sign up with Supabase
            const { data: authData, error } = await this.supabase.auth.signUp({
                email,
                password,
                options: {
                    data: {
                        full_name: fullName || "",
                    },
                    emailRedirectTo: getAuthCallbackUrl(),
                },
            });

            if (error) {
                return {
                    success: false,
                    message: this.getErrorMessage(error),
                    error,
                };
            }

            if (!authData.user) {
                return {
                    success: false,
                    message: "Failed to create account. Please try again.",
                };
            }

            // Check if email confirmation is required
            if (authData.user && !authData.session) {
                return {
                    success: true,
                    message: "Please check your email to confirm your account",
                    user: authData.user,
                };
            }

            return {
                success: true,
                message: "Account created successfully",
                user: authData.user,
                session: authData.session,
            };
        } catch (error) {
            console.error("Sign up error:", error);
            return {
                success: false,
                message: "An unexpected error occurred. Please try again.",
            };
        }
    }

    /**
     * Sign in with email and password
     */
    static async signIn(data: SignInData): Promise<AuthResponse> {
        try {
            const { email, password } = data;

            if (!email || !password) {
                return {
                    success: false,
                    message: "Email and password are required",
                };
            }

            const { data: authData, error } = await this.supabase.auth.signInWithPassword({
                email,
                password,
            });

            if (error) {
                return {
                    success: false,
                    message: this.getErrorMessage(error),
                    error,
                };
            }

            if (!authData.user || !authData.session) {
                return {
                    success: false,
                    message: "Invalid credentials",
                };
            }

            return {
                success: true,
                message: "Signed in successfully",
                user: authData.user,
                session: authData.session,
            };
        } catch (error) {
            console.error("Sign in error:", error);
            return {
                success: false,
                message: "An unexpected error occurred. Please try again.",
            };
        }
    }

    /**
     * Sign in with OAuth provider (Google, Facebook, Apple)
     */
    static async signInWithOAuth(provider: "google" | "facebook" | "apple"): Promise<AuthResponse> {
        try {
            const { error } = await this.supabase.auth.signInWithOAuth({
                provider,
                options: {
                    redirectTo: getAuthCallbackUrl(),
                },
            });

            if (error) {
                return {
                    success: false,
                    message: this.getErrorMessage(error),
                    error,
                };
            }

            return {
                success: true,
                message: `Redirecting to ${provider}...`,
            };
        } catch (error) {
            console.error(`${provider} sign in error:`, error);
            return {
                success: false,
                message: "An unexpected error occurred. Please try again.",
            };
        }
    }

    /**
     * Sign out the current user
     */
    static async signOut(): Promise<AuthResponse> {
        try {
            const { error } = await this.supabase.auth.signOut();

            if (error) {
                return {
                    success: false,
                    message: this.getErrorMessage(error),
                    error,
                };
            }

            return {
                success: true,
                message: "Signed out successfully",
            };
        } catch (error) {
            console.error("Sign out error:", error);
            return {
                success: false,
                message: "An unexpected error occurred. Please try again.",
            };
        }
    }

    /**
     * Get the current user session
     */
    static async getSession(): Promise<{ session: Session | null; user: User | null }> {
        try {
            const { data, error } = await this.supabase.auth.getSession();

            if (error) {
                console.error("Get session error:", error);
                return { session: null, user: null };
            }

            return {
                session: data.session,
                user: data.session?.user || null,
            };
        } catch (error) {
            console.error("Get session error:", error);
            return { session: null, user: null };
        }
    }

    /**
     * Get the current user
     */
    static async getUser(): Promise<User | null> {
        try {
            const { data, error } = await this.supabase.auth.getUser();

            if (error) {
                console.error("Get user error:", error);
                return null;
            }

            return data.user;
        } catch (error) {
            console.error("Get user error:", error);
            return null;
        }
    }

    /**
     * Send password reset email
     */
    static async resetPassword(email: string): Promise<AuthResponse> {
        try {
            if (!email) {
                return {
                    success: false,
                    message: "Email is required",
                };
            }

            const { error } = await this.supabase.auth.resetPasswordForEmail(email, {
                redirectTo: getPasswordResetUrl(),
            });

            if (error) {
                return {
                    success: false,
                    message: this.getErrorMessage(error),
                    error,
                };
            }

            return {
                success: true,
                message: "Password reset email sent. Please check your inbox.",
            };
        } catch (error) {
            console.error("Reset password error:", error);
            return {
                success: false,
                message: "An unexpected error occurred. Please try again.",
            };
        }
    }

    /**
     * Update user password
     */
    static async updatePassword(newPassword: string): Promise<AuthResponse> {
        try {
            if (!newPassword || newPassword.length < 8) {
                return {
                    success: false,
                    message: "Password must be at least 8 characters long",
                };
            }

            const { error } = await this.supabase.auth.updateUser({
                password: newPassword,
            });

            if (error) {
                return {
                    success: false,
                    message: this.getErrorMessage(error),
                    error,
                };
            }

            return {
                success: true,
                message: "Password updated successfully",
            };
        } catch (error) {
            console.error("Update password error:", error);
            return {
                success: false,
                message: "An unexpected error occurred. Please try again.",
            };
        }
    }

    /**
     * Subscribe to auth state changes
     */
    static onAuthStateChange(callback: (event: any, session: Session | null) => void) {
        return this.supabase.auth.onAuthStateChange((event: any, session: Session | null) => {
            callback(event, session);
        });
    }

    /**
     * Convert Supabase auth errors to user-friendly messages
     */
    private static getErrorMessage(error: AuthError): string {
        const messages: Record<string, string> = {
            "Invalid login credentials": "Invalid email or password",
            "Email not confirmed": "Please confirm your email address",
            "User already registered": "An account with this email already exists",
            "Password should be at least 6 characters": "Password must be at least 8 characters long",
        };
        return messages[error.message] || error.message || "An error occurred";
    }
}
