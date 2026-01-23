"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Eye, EyeOff } from "lucide-react";

interface AuthInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    label: string;
    error?: string;
}

export function AuthInput({ label, error, type, className, ...props }: AuthInputProps) {
    const [showPassword, setShowPassword] = useState(false);
    const isPassword = type === "password";
    const inputType = isPassword ? (showPassword ? "text" : "password") : type;

    return (
        <div className="space-y-2">
            <Label className="text-text-secondary font-semibold text-[14px] ml-1">
                {label} {props.required && <span className="text-red-500">*</span>}
            </Label>
            <div className="relative">
                <Input
                    {...props}
                    type={inputType}
                    className={`h-12 rounded-xl border-base-border bg-white focus:border-text-main focus:ring-0 placeholder:text-text-muted text-[15px] transition-all ${isPassword ? 'pr-12' : ''} ${className}`}
                />
                {isPassword && (
                    <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                    >
                        {showPassword ? <Eye className="w-5 h-5" /> : <EyeOff className="w-5 h-5" />}
                    </button>
                )}
            </div>
            {error && <p className="text-xs text-red-500 ml-1">{error}</p>}
        </div>
    );
}
