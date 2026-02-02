"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { type AuthResponse } from "@/services/auth.service";

export function useAuth() {
    const router = useRouter();
    const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
    const [message, setMessage] = useState("");

    const handleAuthAction = async (
        action: () => Promise<AuthResponse>,
        redirectPath?: string
    ) => {
        setStatus("loading");
        setMessage("");

        try {
            const result = await action();
            if (result.success) {
                setStatus("success");
                setMessage(result.message || "Action successful");
                if (redirectPath) {
                    setTimeout(() => router.push(redirectPath), 1500);
                }
                return result;
            } else {
                setStatus("error");
                setMessage(result.message || "An error occurred");
                return result;
            }
        } catch {
            setStatus("error");
            setMessage("An unexpected error occurred");
            return { success: false };
        }
    };

    return {
        status,
        setStatus,
        message,
        setMessage,
        handleAuthAction,
        isLoading: status === "loading",
    };
}
