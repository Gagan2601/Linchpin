'use client';

import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
    DialogClose,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { useForm } from 'react-hook-form';
import { useState } from 'react';
import { toast } from 'sonner';
import { authService } from '@/services/auth';
import { X } from 'lucide-react';

export function ChangePasswordDialog({
    open,
    onOpenChange,
}: {
    open: boolean;
    onOpenChange: (open: boolean) => void;
}) {
    const {
        register,
        handleSubmit,
        formState: { errors },
        reset,
        watch,
    } = useForm<{
        currentPassword: string;
        newPassword: string;
        confirmPassword: string;
    }>();
    const [loading, setLoading] = useState(false);

    const newPassword = watch('newPassword');

    const onSubmit = async (data: {
        currentPassword: string;
        newPassword: string;
        confirmPassword: string;
    }) => {
        if (data.newPassword !== data.confirmPassword) {
            toast.error('New passwords do not match');
            return;
        }
        setLoading(true);
        try {
            const resp = await authService.changePassword(
                data.currentPassword,
                data.newPassword
            );
            if (resp.error) throw new Error(resp.error);
            toast.success('Password changed successfully!');
            reset();
            onOpenChange(false);
        } catch (e: unknown) {
            if (e instanceof Error) {
                toast.error(e.message || 'Failed to change password');
            } else {
                toast.error('Failed to change password');

            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent showCloseButton={false} className="max-w-md bg-white/80 dark:bg-black/40 backdrop-blur-xl border border-black/5 dark:border-white/10 shadow-2xl p-0 overflow-hidden gap-0">
                <DialogHeader className="p-6 border-b border-black/5 dark:border-white/10 relative">
                    <DialogTitle className="text-xl font-bold text-gray-900 dark:text-white">Change Password</DialogTitle>
                    <DialogClose asChild>
                        <button
                            aria-label="Close"
                            className="absolute top-6 right-6 p-1 rounded-full hover:bg-black/5 dark:hover:bg-white/10 text-gray-500 dark:text-white/50 hover:text-gray-900 dark:hover:text-white transition-colors"
                        >
                            <X className="h-5 w-5" />
                        </button>
                    </DialogClose>
                </DialogHeader>

                <form onSubmit={handleSubmit(onSubmit)}>
                    <div className="p-6 space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="currentPassword" className="text-gray-700 dark:text-white/70">Current Password</Label>
                            <Input
                                id="currentPassword"
                                type="password"
                                autoComplete="current-password"
                                className="bg-black/5 dark:bg-white/5 border-black/10 dark:border-white/10 text-gray-900 dark:text-white placeholder:text-gray-500 dark:placeholder:text-white/20 focus:border-primary/50 focus:ring-primary/20"
                                {...register('currentPassword', { required: 'Current password is required' })}
                            />
                            {errors.currentPassword && (
                                <p className="text-xs text-red-500 dark:text-red-400">{errors.currentPassword.message}</p>
                            )}
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="newPassword" className="text-gray-700 dark:text-white/70">New Password</Label>
                            <Input
                                id="newPassword"
                                type="password"
                                autoComplete="new-password"
                                className="bg-black/5 dark:bg-white/5 border-black/10 dark:border-white/10 text-gray-900 dark:text-white placeholder:text-gray-500 dark:placeholder:text-white/20 focus:border-primary/50 focus:ring-primary/20"
                                {...register('newPassword', {
                                    required: 'New password is required',
                                    minLength: { value: 6, message: 'Password must be at least 6 characters' },
                                })}
                            />
                            {errors.newPassword && (
                                <p className="text-xs text-red-500 dark:text-red-400">{errors.newPassword.message}</p>
                            )}
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="confirmPassword" className="text-gray-700 dark:text-white/70">Confirm New Password</Label>
                            <Input
                                id="confirmPassword"
                                type="password"
                                autoComplete="new-password"
                                className="bg-black/5 dark:bg-white/5 border-black/10 dark:border-white/10 text-gray-900 dark:text-white placeholder:text-gray-500 dark:placeholder:text-white/20 focus:border-primary/50 focus:ring-primary/20"
                                {...register('confirmPassword', {
                                    required: 'Please confirm new password',
                                    validate: value =>
                                        value === newPassword || 'Passwords do not match',
                                })}
                            />
                            {errors.confirmPassword && (
                                <p className="text-xs text-red-500 dark:text-red-400">{errors.confirmPassword.message}</p>
                            )}
                        </div>
                    </div>

                    <DialogFooter className="p-6 border-t border-black/5 dark:border-white/10 bg-black/5 dark:bg-white/5 gap-3">
                        <Button
                            type="button"
                            variant="ghost"
                            onClick={() => {
                                reset();
                                onOpenChange(false);
                            }}
                            className="text-gray-600 dark:text-white/70 hover:text-gray-900 dark:hover:text-white hover:bg-black/5 dark:hover:bg-white/10"
                        >
                            Cancel
                        </Button>
                        <Button
                            type="submit"
                            disabled={loading}
                            className="bg-primary hover:bg-primary/90 text-white shadow-lg shadow-primary/20"
                        >
                            {loading ? 'Changing...' : 'Change Password'}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}