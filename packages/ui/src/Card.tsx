import React from 'react';
import { motion, HTMLMotionProps } from 'framer-motion';
import { cn } from './lib/utils';

export interface CardProps extends Omit<HTMLMotionProps<'div'>, 'children'> {
    children: React.ReactNode;
    hover?: boolean;
    variant?: 'default' | 'bordered' | 'elevated';
}

export function Card({ 
    children, 
    className, 
    hover = true,
    variant = 'default',
    ...props 
}: CardProps) {
    const variants = {
        default: "bg-white rounded-2xl shadow-sm",
        bordered: "bg-white rounded-2xl border border-gray-200",
        elevated: "bg-white rounded-2xl shadow-lg",
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            whileHover={hover ? { y: -5, transition: { duration: 0.2 } } : {}}
            className={cn(
                variants[variant],
                "overflow-hidden",
                hover && "hover:shadow-xl transition-shadow duration-300",
                className
            )}
            {...props}
        >
            {children}
        </motion.div>
    );
}

export function CardHeader({ 
    children, 
    className 
}: { 
    children: React.ReactNode; 
    className?: string;
}) {
    return (
        <div className={cn("px-6 py-4 border-b border-gray-100", className)}>
            {children}
        </div>
    );
}

export function CardContent({ 
    children, 
    className 
}: { 
    children: React.ReactNode; 
    className?: string;
}) {
    return (
        <div className={cn("px-6 py-4", className)}>
            {children}
        </div>
    );
}

export function CardFooter({ 
    children, 
    className 
}: { 
    children: React.ReactNode; 
    className?: string;
}) {
    return (
        <div className={cn("px-6 py-4 border-t border-gray-100", className)}>
            {children}
        </div>
    );
}
