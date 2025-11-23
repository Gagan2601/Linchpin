'use client';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import LoginForm from './LoginForm';
import SignupForm from './SignupForm';
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog';
import { cn } from '@/lib/utils';

interface AuthModalProps {
    isOpen: boolean;
    onClose: () => void;
    initialMode?: 'login' | 'signup';
}

export default function AuthModal({ isOpen, onClose, initialMode = 'login' }: AuthModalProps) {
    const [mode, setMode] = useState<'login' | 'signup'>(initialMode);

    useEffect(() => {
        if (isOpen) {
            setMode(initialMode);
        }
    }, [isOpen, initialMode]);

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="p-0 border-0 bg-transparent shadow-none max-w-md w-full overflow-hidden">
                <DialogTitle className="sr-only">Authentication</DialogTitle>
                <div className="relative w-full rounded-3xl overflow-hidden bg-neutral-950/90 border border-white/10 backdrop-blur-xl shadow-2xl">
                    {/* Static Gradient Background */}
                    <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-secondary/10 pointer-events-none" />

                    <div className="relative z-10">
                        {/* Tab Switcher */}
                        <div className="flex border-b border-white/10 bg-white/5">
                            <button
                                onClick={() => setMode('login')}
                                className={cn(
                                    "flex-1 py-4 text-sm font-medium transition-all duration-300",
                                    mode === 'login'
                                        ? "text-white bg-white/10 shadow-[inset_0_-2px_0_0_#6c47ff]"
                                        : "text-white/50 hover:text-white/80 hover:bg-white/5"
                                )}
                            >
                                Login
                            </button>
                            <button
                                onClick={() => setMode('signup')}
                                className={cn(
                                    "flex-1 py-4 text-sm font-medium transition-all duration-300",
                                    mode === 'signup'
                                        ? "text-white bg-white/10 shadow-[inset_0_-2px_0_0_#6c47ff]"
                                        : "text-white/50 hover:text-white/80 hover:bg-white/5"
                                )}
                            >
                                Sign Up
                            </button>
                        </div>

                        {/* Form Container */}
                        <div className="p-8 min-h-[400px]">
                            {mode === 'login' ? (
                                <motion.div
                                    key="login"
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ duration: 0.2 }}
                                >
                                    <LoginForm onSuccess={onClose} />
                                </motion.div>
                            ) : (
                                <motion.div
                                    key="signup"
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ duration: 0.2 }}
                                >
                                    <SignupForm onSuccess={onClose} />
                                </motion.div>
                            )}
                        </div>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}
