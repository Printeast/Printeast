import React from 'react';
import { motion } from 'framer-motion';
import { cn } from './lib/utils';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    children: React.ReactNode;
    variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
    size?: 'sm' | 'md' | 'lg' | 'icon';
    isLoading?: boolean;
}

export function Button({
    children,
    variant = 'primary',
    size = 'md',
    className,
    isLoading,
    disabled,
    type = 'button',
    ...props
}: ButtonProps) {
    const baseStyles = "inline-flex items-center justify-center rounded-full font-semibold transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-pink disabled:opacity-50 disabled:cursor-not-allowed";

    const gradientPrimary = "bg-gradient-to-r from-[#E23E83] to-[#FF7A39]";
    const gradientSubtle = "bg-gradient-to-r from-[#E23E83]/80 to-[#FF7A39]/80";

    const variants = {
        primary: `${gradientPrimary} text-white hover:scale-[1.02] hover:shadow-lg`,
        secondary: `bg-gray-100 text-gray-900 hover:bg-gray-200`,
        outline: `border-2 border-[#E23E83] text-[#E23E83] hover:bg-[#E23E83] hover:text-white`,
        ghost: `text-gray-700 hover:bg-gray-100`,
        danger: `bg-red-600 text-white hover:bg-red-700`,
    };

    const sizes = {
        sm: "px-3 py-1.5 text-sm",
        md: "px-6 py-3 text-base",
        lg: "px-8 py-4 text-lg",
        icon: "p-2",
    };

    return (
        <motion.button
            whileTap={{ scale: 0.98 }}
            type={type}
            className={cn(baseStyles, variants[variant], sizes[size], className)}
            disabled={disabled || isLoading}
            {...props}
        >
            {isLoading ? (
                <div className="w-5 h-5 border-2 border-current border-t-transparent rounded-full animate-spin mr-2" />
            ) : null}
            {children}
        </motion.button>
    );
}
