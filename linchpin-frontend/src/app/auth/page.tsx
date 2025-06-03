import AuthContainer from '@/components/auth/AuthContainer';
import { Suspense } from 'react';

export default function AuthPage() {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <AuthContainer />
        </Suspense>
    );
}