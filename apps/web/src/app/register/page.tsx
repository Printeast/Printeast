'use client';

import { useState, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@repo/ui/Button';
import { Input } from '@repo/ui/Input';
import { Card, CardHeader, CardContent, CardFooter } from '@repo/ui/Card';
import { api } from '@/services/api';

export default function RegisterPage() {
    const router = useRouter();
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        setError('');

        if (password !== confirmPassword) {
            setError('Passwords do not match');
            return;
        }

        if (password.length < 8) {
            setError('Password must be at least 8 characters');
            return;
        }

        setIsLoading(true);

        try {
            const response = await api.register({
                name,
                email,
                password,
                role: 'CREATOR',
            });

            if (response.success) {
                router.push('/dashboard');
            } else {
                setError(response.error || 'Registration failed');
            }
        } catch {
            setError('An unexpected error occurred');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-base-bg px-4 py-12">
            <Card className="w-full max-w-md" hover={false}>
                <CardHeader>
                    <div className="text-center">
                        <h1 className="text-3xl font-bold bg-printeast-gradient bg-clip-text text-transparent">
                            Join Printeast
                        </h1>
                        <p className="mt-2 text-text-secondary">
                            Start your creative journey today
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
                            label="Full Name"
                            type="text"
                            placeholder="John Doe"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            required
                            disabled={isLoading}
                        />

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
                            placeholder="At least 8 characters"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            disabled={isLoading}
                            helperText="Must be at least 8 characters"
                        />

                        <Input
                            label="Confirm Password"
                            type="password"
                            placeholder="Re-enter your password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            required
                            disabled={isLoading}
                        />

                        <Button
                            type="submit"
                            className="w-full"
                            isLoading={isLoading}
                            disabled={isLoading}
                        >
                            {isLoading ? 'Creating account...' : 'Create Account'}
                        </Button>
                    </form>
                </CardContent>

                <CardFooter>
                    <p className="text-center text-sm text-text-secondary w-full">
                        Already have an account?{' '}
                        <a href="/login" className="text-primary-pink hover:underline font-semibold">
                            Sign in
                        </a>
                    </p>
                </CardFooter>
            </Card>
        </div>
    );
}
