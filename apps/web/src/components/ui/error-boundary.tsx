"use client"

import React, { Component, ReactNode } from "react"
import { AlertTriangle, RefreshCw } from "lucide-react"

interface Props {
    children: ReactNode
    fallback?: ReactNode
    onError?: (error: Error, errorInfo: React.ErrorInfo) => void
}

interface State {
    hasError: boolean
    error: Error | null
}

export class ErrorBoundary extends Component<Props, State> {
    constructor(props: Props) {
        super(props)
        this.state = { hasError: false, error: null }
    }

    static getDerivedStateFromError(error: Error): State {
        return { hasError: true, error }
    }

    componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
        // Log to external service in production
        console.error("ErrorBoundary caught:", error, errorInfo)
        this.props.onError?.(error, errorInfo)
    }

    handleRetry = () => {
        this.setState({ hasError: false, error: null })
    }

    render() {
        if (this.state.hasError) {
            if (this.props.fallback) {
                return this.props.fallback
            }

            return (
                <div className="w-full min-h-[300px] flex flex-col items-center justify-center bg-slate-50 rounded-2xl border border-slate-200 p-8 gap-4">
                    <div className="w-16 h-16 rounded-full bg-amber-100 flex items-center justify-center">
                        <AlertTriangle className="w-8 h-8 text-amber-600" />
                    </div>
                    <div className="text-center">
                        <h3 className="text-lg font-bold text-slate-900 mb-1">Something went wrong</h3>
                        <p className="text-sm text-slate-500 max-w-md">
                            This section couldn't load properly. Please try refreshing.
                        </p>
                    </div>
                    <button
                        onClick={this.handleRetry}
                        className="mt-2 px-6 py-2.5 bg-slate-900 text-white text-sm font-bold rounded-xl hover:bg-slate-800 transition-all flex items-center gap-2 hover:scale-105 active:scale-95"
                    >
                        <RefreshCw className="w-4 h-4" />
                        Try Again
                    </button>
                </div>
            )
        }

        return this.props.children
    }
}

// Lightweight wrapper for sections
export function SectionErrorBoundary({ children, name }: { children: ReactNode; name?: string }) {
    return (
        <ErrorBoundary
            fallback={
                <div className="w-full min-h-[200px] flex items-center justify-center bg-slate-50/50 rounded-2xl">
                    <p className="text-slate-400 text-sm font-medium">
                        {name ? `${name} unavailable` : "Section unavailable"}
                    </p>
                </div>
            }
        >
            {children}
        </ErrorBoundary>
    )
}
