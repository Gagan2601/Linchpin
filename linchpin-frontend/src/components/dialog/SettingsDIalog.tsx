'use client';

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogClose } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { useState } from 'react';
import { ForgotPasswordDialog } from '@/components/dialog/ForgotPasswordDialog';
import { DeleteAccountDialog } from '@/components/dialog/DeleteAccountDialog';
import { X } from 'lucide-react';

export function SettingsDialog({
    open,
    onOpenChange,
}: {
    open: boolean;
    onOpenChange: (open: boolean) => void;
}) {
    const [forgotOpen, setForgotOpen] = useState(false);
    const [deleteOpen, setDeleteOpen] = useState(false);

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent showCloseButton={false} className="max-w-md bg-white/80 dark:bg-black/40 backdrop-blur-xl border border-black/5 dark:border-white/10 shadow-2xl p-0 overflow-hidden gap-0">
                <DialogHeader className="p-6 border-b border-black/5 dark:border-white/10 relative">
                    <DialogTitle className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                        Settings
                    </DialogTitle>
                    <DialogClose asChild>
                        <button
                            aria-label="Close"
                            className="absolute top-6 right-6 p-1 rounded-full hover:bg-black/5 dark:hover:bg-white/10 text-gray-500 dark:text-white/50 hover:text-gray-900 dark:hover:text-white transition-colors"
                        >
                            <X className="h-5 w-5" />
                        </button>
                    </DialogClose>
                </DialogHeader>

                <div className="p-6 space-y-6">
                    <p className="text-sm text-gray-500 dark:text-white/60">
                        Manage your account security and preferences.
                    </p>

                    <div className="space-y-4">
                        <div className="rounded-2xl bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 p-5 space-y-4">
                            <div>
                                <h4 className="font-medium text-gray-900 dark:text-white mb-1">Account Security</h4>
                                <p className="text-xs text-gray-500 dark:text-white/50 mb-4">
                                    Update your password and secure your account.
                                </p>
                                <Button
                                    variant="outline"
                                    className="w-full justify-start border-black/10 dark:border-white/10 bg-white dark:bg-white/5 hover:bg-gray-50 dark:hover:bg-white/10 text-gray-700 dark:text-white hover:text-gray-900 dark:hover:text-white"
                                    onClick={() => setForgotOpen(true)}
                                >
                                    Reset Password
                                </Button>
                            </div>
                        </div>

                        <div className="rounded-2xl bg-red-50 dark:bg-red-500/5 border border-red-100 dark:border-red-500/10 p-5 space-y-4">
                            <div>
                                <h4 className="font-medium text-red-600 dark:text-red-400 mb-1">Danger Zone</h4>
                                <p className="text-xs text-red-500/80 dark:text-red-400/60 mb-4">
                                    Permanently delete your account and all data.
                                </p>
                                <Button
                                    variant="ghost"
                                    className="w-full justify-start text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 hover:bg-red-50 dark:hover:bg-red-500/10 border border-red-200 dark:border-red-500/20"
                                    onClick={() => setDeleteOpen(true)}
                                >
                                    Delete Account
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Modals */}
                <ForgotPasswordDialog open={forgotOpen} onOpenChange={setForgotOpen} />
                <DeleteAccountDialog open={deleteOpen} onOpenChange={setDeleteOpen} />
            </DialogContent>
        </Dialog>
    );
}