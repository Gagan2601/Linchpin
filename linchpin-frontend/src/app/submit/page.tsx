'use client';

import { motion, AnimatePresence } from "framer-motion";

export default function SubmitPage() {
    return (
        <div className="flex min-h-[70vh] flex-col items-center justify-center px-4 py-24 ">
            {/* Animated "Coming Soon" */}
            <div className="relative flex flex-col items-center">
                {/* Glowing pulse ring behind text */}
                <motion.div
                    className="absolute inset-0 flex items-center justify-center"
                    initial={{ opacity: 0.5, scale: 0.9 }}
                    animate={{
                        opacity: [0.5, 1, 0.5],
                        scale: [0.9, 1.1, 0.9]
                    }}
                    transition={{
                        duration: 2,
                        repeat: Infinity,
                        ease: "easeInOut"
                    }}
                >
                    <div className="w-64 h-28 rounded-full bg-gradient-to-tr from-blue-400 to-purple-400 blur-3xl opacity-50" />
                </motion.div>
                <motion.h1
                    className="relative z-10 text-4xl md:text-6xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-purple-500 to-pink-500 drop-shadow-lg text-center"
                    initial={{ scale: 0.95, letterSpacing: "0.1em" }}
                    animate={{
                        scale: [0.95, 1.05, 0.95],
                        letterSpacing: ["0.1em", "0.25em", "0.1em"]
                    }}
                    transition={{
                        duration: 2.4,
                        repeat: Infinity,
                        ease: "easeInOut"
                    }}
                >
                    Coming Soon
                </motion.h1>
                {/* Animated underline */}
                <motion.div
                    className="relative z-10 mt-2 w-full h-2 rounded-full bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400"
                    initial={{ scaleX: 0.6, opacity: 0.7 }}
                    animate={{
                        scaleX: [0.6, 1, 0.6],
                        opacity: [0.7, 1, 0.7]
                    }}
                    transition={{
                        duration: 2.4,
                        repeat: Infinity,
                        ease: "easeInOut"
                    }}
                />
            </div>
            {/* Animated bubbles */}
            <AnimatePresence>
                <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
                    {[...Array(6)].map((_, i) => (
                        <motion.div
                            key={i}
                            className="absolute rounded-full"
                            style={{
                                width: 40 + Math.random() * 40,
                                height: 40 + Math.random() * 40,
                                left: `${10 + Math.random() * 80}%`,
                                top: `${80 + Math.random() * 10}%`,
                                background: "linear-gradient(135deg, #60a5fa80 0%, #a78bfa80 100%)",
                                filter: "blur(6px)",
                                opacity: 0.4 + Math.random() * 0.3,
                            }}
                            initial={{ y: 0 }}
                            animate={{ y: [-10, -160 - i * 30] }}
                            transition={{
                                duration: 6 + i * 1.5,
                                repeat: Infinity,
                                repeatType: "loop",
                                delay: i * 0.6,
                                ease: "easeInOut"
                            }}
                        />
                    ))}
                </div>
            </AnimatePresence>
            {/* Subtext */}
            <motion.p
                className="relative z-10 mt-8 md:mt-12 text-lg md:text-2xl text-gray-500 text-center font-medium"
                initial={{ opacity: 0.7, y: 8 }}
                animate={{ opacity: [0.7, 1, 0.7], y: [8, 0, 8] }}
                transition={{
                    duration: 2.5,
                    repeat: Infinity,
                    ease: "easeInOut"
                }}
            >
                Our AI tool submission portal is arriving soon.<br />
                Stay tuned!
            </motion.p>
        </div>
    );
}