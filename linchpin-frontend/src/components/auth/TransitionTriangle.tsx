'use client';
import { motion } from 'framer-motion';

export default function TransitionTriangle({
    isLogin,
    onClick,
    disabled
}: {
    isLogin: boolean;
    onClick: () => void;
    disabled: boolean;
}) {
    return (
        <motion.div
            className={`relative w-24 h-24 md:w-28 md:h-28 cursor-pointer rounded-br-4xl
                ${disabled ? 'opacity-0 pointer-events-none' :
                    isLogin ? 'bg-primary' : 'bg-secondary'}`}
            initial={{ clipPath: 'polygon(100% 15%, 15% 100%, 100% 100%)' }}
            whileHover={{
                clipPath: 'polygon(100% 0%, 0% 100%, 100% 100%)',
                transition: { duration: 0.2 }
            }}
            onClick={disabled ? undefined : onClick}
        >
            <motion.span
                className="absolute bottom-1 right-2 md:bottom-2 md:right-3 text-white font-bold text-base select-none"
                initial={{ opacity: 0.9 }}
                whileHover={{
                    opacity: 1,
                    scale: 1.05
                }}
                transition={{ duration: 0.2 }}
            >
                {isLogin ? 'Signup' : 'Login'}
            </motion.span>
        </motion.div>
    );
}