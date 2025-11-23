'use client';

import { useSearchParams, useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useState } from 'react';
import { authService } from '@/services/auth';
import { toast } from 'sonner';

export default function ResetPasswordClient() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const token = searchParams.get('token');
    const { register, handleSubmit, formState: { errors } } = useForm<{ password: string; confirm: string }>();
    const [loading, setLoading] = useState(false);

    const onSubmit = async (data: { password: string; confirm: string }) => {
        if (data.password !== data.confirm) {
            toast.error("Passwords do not match");
            return;
        }
        setLoading(true);
        try {
            const resp = await authService.resetPassword(token || '', data.password);
            if (resp.error) throw new Error(resp.error);
            toast.success(resp.message || "Password reset successfully. Please login.");
            router.push('/auth?mode=login');
        } catch (err: unknown) {
            if (err instanceof Error) {
                toast.error(err.message || "Failed to reset password.");
            } else {
                toast.error("Failed to reset password.");
            }
        } finally {
            setLoading(false);
        }
    };

    if (!token) return <div className="p-4 text-center text-destructive">Missing or invalid token</div>;

    return (
        <div className="max-w-md mx-auto p-6 mt-12 bg-card rounded-xl shadow">
            <h1 className="text-2xl font-bold mb-4">Reset Password</h1>
            <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
                <div className="space-y-2">
                    <Label htmlFor="password">New Password</Label>
                    <Input
                        id="password"
                        type="password"
                        {...register('password', {
                            required: 'Password is required',
                            minLength: { value: 6, message: 'Password must be at least 6 characters' },
                        })}
                    />
                    {errors.password && <p className="text-xs text-red-500">{errors.password.message}</p>}
                </div>
                <div className="space-y-2">
                    <Label htmlFor="confirm">Confirm Password</Label>
                    <Input
                        id="confirm"
                        type="password"
                        {...register('confirm', {
                            required: 'Please confirm your password',
                        })}
                    />
                    {errors.confirm && <p className="text-xs text-red-500">{errors.confirm.message}</p>}
                </div>
                <Button type="submit" className="w-full" disabled={loading}>
                    {loading ? 'Resetting...' : 'Reset Password'}
                </Button>
            </form>
        </div>
    );
}