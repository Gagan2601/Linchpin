"use client";
import React from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

export const BackgroundBeams = ({ className }: { className?: string }) => {
    return (
        <div
            className={cn(
                "absolute inset-0 z-0 w-full h-full flex flex-col items-center justify-center overflow-hidden bg-background",
                className
            )}
        >
            <div className="absolute inset-0 bg-gradient-to-b from-background/5 via-background/20 to-background/80 z-20 pointer-events-none" />

            {/* Grid Pattern */}
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] pointer-events-none" />

            {/* Glowing Orbs/Beams */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full z-0 overflow-hidden">
                {/* Left Purple Glow */}
                <motion.div
                    initial={{ opacity: 0.5, scale: 0.8 }}
                    animate={{ opacity: [0.4, 0.6, 0.4], scale: [0.8, 1.1, 0.8] }}
                    transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
                    className="sm:absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-primary/30 rounded-full blur-[120px]"
                />

                {/* Right Purple Glow */}
                <motion.div
                    initial={{ opacity: 0.5, scale: 0.8 }}
                    animate={{ opacity: [0.4, 0.6, 0.4], scale: [0.8, 1.1, 0.8] }}
                    transition={{ duration: 12, repeat: Infinity, ease: "easeInOut", delay: 2 }}
                    className="sm:absolute top-[-10%] right-[-10%] w-[500px] h-[500px] bg-primary/30 rounded-full blur-[120px]"
                />

                {/* Secondary Red Glow (Logo Accent) - Increased Opacity */}
                <motion.div
                    initial={{ opacity: 0.4, x: -100 }}
                    animate={{ opacity: [0.3, 0.6, 0.3], x: [100, -100, 100] }}
                    transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
                    className="sm:absolute top-[10%] left-1/2 -translate-x-1/2 w-[400px] h-[400px] bg-red-500/20 rounded-full blur-[100px]"
                />

                {/* Floating Neural Sparks */}
                <div className="absolute inset-0 overflow-hidden">
                    {[...Array(200)].map((_, i) => (
                        <motion.div
                            key={i}
                            initial={{
                                opacity: 0,
                                scale: 0,
                            }}
                            animate={{
                                opacity: [0, 1, 0],
                                scale: [0, Math.random() * 1.5 + 0.5, 0],
                                y: [0, Math.random() * -100 - 50], // Float up 50-150px
                                x: [(Math.random() - 0.5) * 50, (Math.random() - 0.5) * 50], // Small drift
                            }}
                            transition={{
                                duration: Math.random() * 3 + 2, // 2-5 seconds (faster)
                                repeat: Infinity,
                                delay: Math.random() * 5,
                                ease: "easeInOut",
                            }}
                            style={{
                                left: `${Math.random() * 100}%`,
                                top: `${Math.random() * 100}%`,
                            }}
                            className={cn(
                                "absolute rounded-full blur-[0.5px]",
                                i % 3 === 0 ? "w-2 h-2 bg-primary" : "w-2 h-2 bg-secondary"
                            )}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
};
