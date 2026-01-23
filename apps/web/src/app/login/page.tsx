'use client';

import { useState, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@repo/ui/Button';
import { Input } from '@repo/ui/Input';
import { Card, CardHeader, CardContent, CardFooter } from '@repo/ui/Card';
import { api } from '@/services/api';

export default function LoginPage() {
    const router = useRouter();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);

        try {
            const response = await api.login({ email, password });

            if (response.success) {
                router.push('/dashboard');
            } else {
                setError(response.error || 'Login failed');
            }
        } catch (err) {
            setError('An unexpected error occurred');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-base-bg px-4">
            <Card className="w-full max-w-md" hover={false}>
                <CardHeader>
                    <div className="text-center">
                        <h1 className="text-3xl font-bold bg-printeast-gradient bg-clip-text text-transparent">
                            Welcome Back
                        </h1>
                        <p className="mt-2 text-text-secondary">
                            Sign in to your Printeast account
                        </p>
                    </div>
                </CardHeader>

                <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        {error && (
                            <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm">
                                {error}
                            </div>
                        )}

                        <Input
                            label="Email"
                            type="email"
                            placeholder="you@example.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            disabled={isLoading}
                        />

                        <Input
                            label="Password"
                            type="password"
                            placeholder="Enter your password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            disabled={isLoading}
                        />

                        <Button
                            type="submit"
                            className="w-full"
                            isLoading={isLoading}
                            disabled={isLoading}
                        >
                            {isLoading ? 'Signing in...' : 'Sign In'}
                        </Button>
                    </form>
                </CardContent>

                <CardFooter>
                    <p className="text-center text-sm text-text-secondary w-full">
                        Don't have an account?{' '}
                        <a href="/register" className="text-primary-pink hover:underline font-semibold">
                            Sign up
                        </a>
                    </p>
                </CardFooter>
            </Card>
        </div>
    );
}
