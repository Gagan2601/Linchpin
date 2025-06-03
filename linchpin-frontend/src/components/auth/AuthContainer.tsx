'use client';
import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import LoginForm from './LoginForm';
import SignupForm from './SignupForm';
import TransitionTriangle from './TransitionTriangle';

export default function AuthContainer() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const initialMode = searchParams.get('mode') === 'signup' ? 'signup' : 'login';
    const [mode, setMode] = useState(initialMode);
    const [isAnimating, setIsAnimating] = useState(false);

    const toggleMode = () => {
        if (isAnimating) return;

        setIsAnimating(true);
        const newMode = mode === 'login' ? 'signup' : 'login';
        router.replace(`/auth?mode=${newMode}`, { scroll: false });
    };

    useEffect(() => {
        if (isAnimating) {
            const timer = setTimeout(() => {
                setMode(prev => (prev === 'login' ? 'signup' : 'login'));
                setIsAnimating(false);
            }, 500);
            return () => clearTimeout(timer);
        }
    }, [isAnimating]);

    return (
        <div className="relative min-h-screen w-full bg-gradient-to-br from-[#f3f7fc] to-[#e2e8f0] dark:from-[#1a202c] dark:to-[#2d3748] flex items-center justify-center p-4">
            {/* Glow Wrapper - Maintains current mode's color */}
            <div className={`relative w-full max-w-md rounded-2xl h-[600px] ${mode === 'login'
                    ? 'shadow-[0_0_60px_rgba(108,71,255,0.3)] hover:shadow-[0_0_80px_rgba(108,71,255,0.5)]'
                    : 'shadow-[0_0_60px_rgba(0,193,160,0.3)] hover:shadow-[0_0_80px_rgba(0,193,160,0.5)]'
                } transition-all duration-300`}>

                {/* Form Container */}
                <div className="absolute inset-0 overflow-hidden rounded-2xl">
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={mode}
                            initial={{ opacity: 0, x: 50 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -50 }}
                            transition={{ duration: 0.5 }}
                            className="absolute inset-0 bg-white dark:bg-gray-800 flex items-center justify-center rounded-2xl"
                        >
                            {mode === 'login' ? <LoginForm /> : <SignupForm />}
                        </motion.div>
                    </AnimatePresence>

                    <TransitionTriangle
                        isLogin={mode === 'login'}
                        onClick={toggleMode}
                        disabled={isAnimating}
                    />
                </div>
            </div>
        </div>
    );
}