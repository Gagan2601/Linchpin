'use client';

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogClose } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { useState } from 'react';
import { toast } from 'sonner';
import { userService } from '@/services/user';
import { useAuth } from '@/context/AuthContext';
import { X } from 'lucide-react';

export function DeleteAccountDialog({
    open,
    onOpenChange,
}: {
    open: boolean;
    onOpenChange: (open: boolean) => void;
}) {
    const [loading, setLoading] = useState(false);
    const { user, logout } = useAuth();

    const onDelete = async () => {
        if (!user) return;
        setLoading(true);
        try {
            const resp = await userService.deleteUser(user._id);
            if (resp.error) throw new Error(resp.error);
            toast.success('Account deleted');
            logout(); // Log out user after deletion
            // Optionally, redirect to home or goodbye page
        } catch (e: unknown) {
            if (e instanceof Error) {
                toast.error(e.message || 'Failed to delete account');
            } else {
                toast.error('Failed to delete account');

            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent showCloseButton={false} className="max-w-md bg-white/80 dark:bg-black/40 backdrop-blur-xl border border-black/5 dark:border-white/10 shadow-2xl p-0 overflow-hidden gap-0">
                <DialogHeader className="p-6 border-b border-black/5 dark:border-white/10 relative">
                    <DialogTitle className="text-xl font-bold text-red-600 dark:text-red-400">Delete Account</DialogTitle>
                    <DialogClose asChild>
                        <button
                            aria-label="Close"
                            className="absolute top-6 right-6 p-1 rounded-full hover:bg-black/5 dark:hover:bg-white/10 text-gray-500 dark:text-white/50 hover:text-gray-900 dark:hover:text-white transition-colors"
                        >
                            <X className="h-5 w-5" />
                        </button>
                    </DialogClose>
                </DialogHeader>

                <div className="p-6">
                    <div className="rounded-xl bg-red-50 dark:bg-red-500/10 border border-red-100 dark:border-red-500/20 p-4 mb-4">
                        <p className="text-red-700 dark:text-red-300 text-sm leading-relaxed">
                            <span className="font-bold block mb-1">Warning: This action is irreversible.</span>
                            Are you sure you want to delete your account? All your data, preferences, and history will be permanently removed.
                        </p>
                    </div>
                </div>

                <DialogFooter className="p-6 border-t border-black/5 dark:border-white/10 bg-black/5 dark:bg-white/5 gap-3">
                    <Button
                        variant="ghost"
                        onClick={() => onOpenChange(false)}
                        className="text-gray-600 dark:text-white/70 hover:text-gray-900 dark:hover:text-white hover:bg-black/5 dark:hover:bg-white/10"
                    >
                        Cancel
                    </Button>
                    <Button
                        variant="destructive"
                        onClick={onDelete}
                        disabled={loading}
                        className="bg-red-600 dark:bg-red-500 hover:bg-red-700 dark:hover:bg-red-600 text-white shadow-lg shadow-red-500/20"
                    >
                        {loading ? 'Deleting...' : 'Delete Account'}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}