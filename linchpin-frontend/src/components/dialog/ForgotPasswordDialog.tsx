'use client';

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogClose } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { useForm } from 'react-hook-form';
import { useState } from 'react';
import { toast } from 'sonner';
import { authService } from '@/services/auth';
import { X } from 'lucide-react';

export function ForgotPasswordDialog({ open, onOpenChange }: { open: boolean; onOpenChange: (open: boolean) => void }) {
    const { register, handleSubmit, formState: { errors }, reset } = useForm<{ email: string }>();
    const [loading, setLoading] = useState(false);

    const onSubmit = async (data: { email: string }) => {
        setLoading(true);
        try {
            const resp = await authService.forgotPassword(data.email);
            if (resp.error) throw new Error(resp.error);
            toast.success(resp.message || "If the email exists, a reset link has been sent.");
            reset();
            onOpenChange(false);
        } catch (err: unknown) {
            if (err instanceof Error) {
                toast.error(err.message || "Failed to request password reset.");
            } else {
                toast.error("Failed to request password reset.");
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent showCloseButton={false} className="max-w-md bg-white/80 dark:bg-black/40 backdrop-blur-xl border border-black/5 dark:border-white/10 shadow-2xl p-0 overflow-hidden gap-0">
                <DialogHeader className="p-6 border-b border-black/5 dark:border-white/10 relative">
                    <DialogTitle className="text-xl font-bold text-gray-900 dark:text-white">Forgot Password</DialogTitle>
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
                        <p className="text-sm text-gray-500 dark:text-white/60">
                            Enter your email address and we'll send you a link to reset your password.
                        </p>
                        <div className="space-y-2">
                            <Label htmlFor="email" className="text-gray-700 dark:text-white/70">Email</Label>
                            <Input
                                id="email"
                                type="email"
                                placeholder="your@email.com"
                                className="bg-black/5 dark:bg-white/5 border-black/10 dark:border-white/10 text-gray-900 dark:text-white placeholder:text-gray-500 dark:placeholder:text-white/20 focus:border-primary/50 focus:ring-primary/20"
                                {...register('email', {
                                    required: 'Email is required',
                                    pattern: {
                                        value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                                        message: 'Invalid email address',
                                    },
                                })}
                            />
                            {errors.email && <p className="text-xs text-red-500 dark:text-red-400">{errors.email.message}</p>}
                        </div>
                    </div>

                    <DialogFooter className="p-6 border-t border-black/5 dark:border-white/10 bg-black/5 dark:bg-white/5 gap-3">
                        <Button
                            type="button"
                            variant="ghost"
                            onClick={() => onOpenChange(false)}
                            className="text-gray-600 dark:text-white/70 hover:text-gray-900 dark:hover:text-white hover:bg-black/5 dark:hover:bg-white/10"
                        >
                            Cancel
                        </Button>
                        <Button
                            type="submit"
                            disabled={loading}
                            className="bg-primary hover:bg-primary/90 text-white shadow-lg shadow-primary/20"
                        >
                            {loading ? 'Sending...' : 'Send Reset Link'}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}