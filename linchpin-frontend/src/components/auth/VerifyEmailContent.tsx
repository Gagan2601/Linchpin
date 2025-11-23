'use client';
import { useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';

export default function VerifyEmailContent() {
    const searchParams = useSearchParams();
    const token = searchParams.get('token');
    const { verifyEmail, isLoading } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (token) {
            verifyEmail(token);
        } else {
            router.push('/auth?mode=login');
        }
    }, [token, verifyEmail, router]);

    return (
        <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-6">
            <div className="text-center space-y-2">
                <h1 className="text-3xl font-bold">Email Verification</h1>
                {isLoading ? (
                    <div className="flex items-center justify-center gap-2">
                        <Loader2 className="h-4 w-4 animate-spin" />
                        <p className="text-muted-foreground">Verifying your email...</p>
                    </div>
                ) : (
                    <p className="text-muted-foreground">
                        Your email has been verified successfully!
                    </p>
                )}
            </div>
            {!isLoading && (
                <Button onClick={() => router.push('/auth?mode=login')}>
                    Go to Login
                </Button>
            )}
        </div>
    );
}
