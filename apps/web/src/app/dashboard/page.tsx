'use client';

import { useState } from 'react';
import { Button } from '@repo/ui/Button';
import { Input } from '@repo/ui/Input';
import { Card, CardHeader, CardContent } from '@repo/ui/Card';
import { api } from '@/services/api';

export default function DashboardPage() {
    const [fileName, setFileName] = useState('');
    const [fileType, setFileType] = useState('image/png');
    const [signedUrl, setSignedUrl] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    const handleGetSignedUrl = async () => {
        if (!fileName) {
            setError('Please enter a file name');
            return;
        }

        setIsLoading(true);
        setError('');
        setSignedUrl('');

        try {
            const response = await api.getSignedUrl(fileName, fileType);

            if (response.success && response.data) {
                setSignedUrl(response.data.signedUrl);
            } else {
                setError(response.error || 'Failed to get signed URL');
            }
        } catch (err) {
            setError('An unexpected error occurred');
        } finally {
            setIsLoading(false);
        }
    };

    const handleLogout = async () => {
        await api.logout();
        window.location.href = '/login';
    };

    return (
        <div className="min-h-screen bg-base-bg">
            <nav className="bg-white border-b border-base-border">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center h-16">
                        <h1 className="text-2xl font-bold bg-printeast-gradient bg-clip-text text-transparent">
                            Printeast Dashboard
                        </h1>
                        <Button variant="outline" size="sm" onClick={handleLogout}>
                            Logout
                        </Button>
                    </div>
                </div>
            </nav>

            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <Card>
                        <CardHeader>
                            <h2 className="text-xl font-semibold">Welcome!</h2>
                        </CardHeader>
                        <CardContent>
                            <p className="text-text-secondary">
                                This dashboard demonstrates the integration of our custom UI components
                                with the backend API.
                            </p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <h2 className="text-xl font-semibold">Components</h2>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-3">
                                <div>
                                    <p className="text-sm font-medium text-text-secondary mb-2">Button Variants:</p>
                                    <div className="flex flex-wrap gap-2">
                                        <Button size="sm">Primary</Button>
                                        <Button size="sm" variant="secondary">Secondary</Button>
                                        <Button size="sm" variant="outline">Outline</Button>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <h2 className="text-xl font-semibold">API Integration</h2>
                        </CardHeader>
                        <CardContent>
                            <p className="text-text-secondary text-sm">
                                All components are connected to the Express backend with proper authentication
                                and secure API calls.
                            </p>
                        </CardContent>
                    </Card>
                </div>

                <div className="mt-8">
                    <Card hover={false}>
                        <CardHeader>
                            <h2 className="text-xl font-semibold">Storage API Test</h2>
                            <p className="text-sm text-text-secondary mt-1">
                                Test the backend storage service integration
                            </p>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                {error && (
                                    <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm">
                                        {error}
                                    </div>
                                )}

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <Input
                                        label="File Name"
                                        placeholder="my-design.png"
                                        value={fileName}
                                        onChange={(e) => setFileName(e.target.value)}
                                        disabled={isLoading}
                                    />

                                    <Input
                                        label="File Type"
                                        placeholder="image/png"
                                        value={fileType}
                                        onChange={(e) => setFileType(e.target.value)}
                                        disabled={isLoading}
                                    />
                                </div>

                                <Button
                                    onClick={handleGetSignedUrl}
                                    isLoading={isLoading}
                                    disabled={isLoading}
                                >
                                    Get Signed Upload URL
                                </Button>

                                {signedUrl && (
                                    <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                                        <p className="text-sm font-medium text-green-900 mb-2">
                                            Signed URL Generated:
                                        </p>
                                        <code className="text-xs text-green-700 break-all">
                                            {signedUrl}
                                        </code>
                                    </div>
                                )}
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </main>
        </div>
    );
}
