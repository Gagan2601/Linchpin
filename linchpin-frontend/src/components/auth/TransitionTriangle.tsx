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
            className={`absolute bottom-0 right-0 w-32 h-32 cursor-pointer ${disabled ? 'opacity-0' : isLogin ? 'bg-primary' : 'bg-secondary'
                }`}
            initial={{ clipPath: 'polygon(100% 20%, 20% 100%, 100% 100%)' }}
            whileHover={{
                clipPath: 'polygon(100% 0%, 0% 100%, 100% 100%)',
                transition: { duration: 0.2 }
            }}
            onClick={disabled ? undefined : onClick}
        >
            <motion.span
                className="absolute bottom-2 right-2 text-white font-bold text-base"
                initial={{ opacity: 0.9 }}
                whileHover={{
                    opacity: 1,
                    scale: 1.05
                }}
                transition={{ duration: 0.2 }}
            >
                {isLogin ? 'SignUp' : 'LogIn'}
            </motion.span>
        </motion.div>
    );
}