'use client';
import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import LoginForm from './LoginForm';
import SignupForm from './SignupForm';
import { BackgroundBeams } from '../ui/background-beams';
import { cn } from '@/lib/utils';

export default function AuthContainer() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const initialMode = searchParams.get('mode') === 'signup' ? 'signup' : 'login';
    const [mode, setMode] = useState<'login' | 'signup'>(initialMode);

    useEffect(() => {
        const newMode = searchParams.get('mode') === 'signup' ? 'signup' : 'login';
        if (newMode !== mode) {
            setMode(newMode);
        }
    }, [searchParams, mode]);

    const switchMode = (newMode: 'login' | 'signup') => {
        setMode(newMode);
        router.replace(`/auth?mode=${newMode}`, { scroll: false });
    };

    return (
        <div className="relative min-h-screen w-full flex items-center justify-center overflow-hidden bg-neutral-950">
            <BackgroundBeams className="absolute inset-0 opacity-50" />

            <div className="relative z-10 w-full max-w-md px-4">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-3xl shadow-2xl overflow-hidden"
                >
                    {/* Tab Switcher */}
                    <div className="flex border-b border-white/10">
                        <button
                            onClick={() => switchMode('login')}
                            className={cn(
                                "flex-1 py-4 text-sm font-medium transition-colors relative",
                                mode === 'login' ? "text-white" : "text-white/50 hover:text-white/80"
                            )}
                        >
                            Login
                            {mode === 'login' && (
                                <motion.div
                                    layoutId="activeTab"
                                    className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary"
                                />
                            )}
                        </button>
                        <button
                            onClick={() => switchMode('signup')}
                            className={cn(
                                "flex-1 py-4 text-sm font-medium transition-colors relative",
                                mode === 'signup' ? "text-white" : "text-white/50 hover:text-white/80"
                            )}
                        >
                            Sign Up
                            {mode === 'signup' && (
                                <motion.div
                                    layoutId="activeTab"
                                    className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary"
                                />
                            )}
                        </button>
                    </div>

                    {/* Form Container */}
                    <div className="p-8">
                        <AnimatePresence mode="wait">
                            <motion.div
                                key={mode}
                                initial={{ opacity: 0, x: mode === 'login' ? -20 : 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: mode === 'login' ? 20 : -20 }}
                                transition={{ duration: 0.3 }}
                            >
                                {mode === 'login' ? <LoginForm /> : <SignupForm />}
                            </motion.div>
                        </AnimatePresence>
                    </div>
                </motion.div>
            </div>
        </div>
    );
}