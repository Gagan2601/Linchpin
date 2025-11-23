'use client';

import { Logo } from "@/components/Logo";
import { motion } from "framer-motion";

// Watermark Globe SVG for the Nexus theme (theme-matched)
function NexusGlobe() {
    return (
        <motion.div
            className="fixed inset-0 flex mt-8 items-center justify-center pointer-events-none select-none"
            style={{ width: "100vw", height: "100vh", opacity: 0.27 }}// Increased from 0.13 to 0.27
            animate={{ rotate: 360 }}
            transition={{ repeat: Infinity, duration: 60, ease: "linear" }}
        >
            <svg
                viewBox="0 0 700 700"
                fill="none"
                width="100%"
                height="100%"
            >
                <circle cx="350" cy="350" r="320" stroke="var(--primary)" strokeWidth="3" opacity="0.4" />
                <ellipse cx="350" cy="350" rx="280" ry="120" stroke="var(--secondary)" strokeWidth="2" opacity="0.28" />
                <ellipse cx="350" cy="350" rx="220" ry="50" stroke="var(--primary)" strokeWidth="2" opacity="0.19" />
                <ellipse cx="350" cy="350" rx="320" ry="170" stroke="var(--secondary)" strokeWidth="1.5" opacity="0.15" />
                {Array.from({ length: 7 }).map((_, i) => {
                    const angle = (i * Math.PI) / 7;
                    return (
                        <motion.circle
                            key={i}
                            cx={350 + 220 * Math.cos(angle)}
                            cy={350 + 220 * Math.sin(angle)}
                            r="12"
                            fill="var(--primary)"
                            opacity="0.25"
                            animate={{
                                opacity: [0.22, 0.34, 0.22],
                                scale: [1, 1.15, 1],
                            }}
                            transition={{
                                repeat: Infinity,
                                duration: 3 + i * 0.3,
                                delay: i * 0.16,
                                ease: "easeInOut",
                            }}
                        />
                    );
                })}
            </svg>
        </motion.div >
    );
}

// Card Section for Key Callouts, theme-matched
function CalloutCard({
    children,
    icon,
}: {
    children: React.ReactNode;
    icon: React.ReactNode;
}) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 32 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, type: "spring" }}
            className="relative rounded-2xl border border-[var(--primary)]/15 bg-[var(--card)]/80 dark:bg-[var(--card)]/80 backdrop-blur-md shadow-glow-primary px-6 md:px-10 py-8 my-7 w-full"
        >
            <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-[var(--background)] border border-[var(--primary)]/20 rounded-full shadow px-4 py-2 text-3xl">
                {icon}
            </div>
            <div className="mt-4">{children}</div>
        </motion.div>
    );
}

export default function AboutUsPage() {
    return (
        <main className="relative bg-[var(--background)] min-h-screen w-full flex flex-col items-center px-2 md:px-0 overflow-x-hidden pt-5">
            <NexusGlobe />

            <section className="relative w-full max-w-4xl md:max-w-6xl mx-auto pt-20 md:pt-28 flex flex-col items-center z-10">
                <motion.h1
                    initial={{ opacity: 0, y: 32 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, type: "spring" }}
                    className="text-4xl md:text-6xl font-bold text-center mb-10 md:mb-12 text-[var(--primary)] drop-shadow-lg"
                >
                    About Us
                </motion.h1>
                <motion.p
                    initial={{ opacity: 0, y: 24 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.15, duration: 0.7, type: "spring" }}
                    className="text-lg md:text-xl text-center mb-10 md:mb-12 font-medium text-[var(--foreground)]"
                >
                    In the chaos of endless AI tools, platforms, and promises — <span className="font-semibold text-[var(--primary)]">something was missing: a center, a compass, a linchpin.</span>
                    <br />
                    <span className="text-[var(--secondary)] font-semibold">That’s why we created Linchpin — the nexus of AI in the world.</span>
                </motion.p>

                <CalloutCard icon={<span className="text-3xl">🧭</span>}>
                    <p className="text-lg text-center text-[var(--foreground)]/90">
                        Founded and owned by <b className="text-[var(--primary)]">Sarvaarth</b>, Linchpin was born from a deep need for clarity in a rapidly expanding AI universe.<br />
                        As technology evolves at breakneck speed, the challenge isn’t access — it’s <b className="text-[var(--primary)]">alignment</b>.<br />
                        With thousands of tools scattered across industries, most people feel overwhelmed, not empowered.
                    </p>
                </CalloutCard>

                <CalloutCard icon={<span className="text-3xl">🔑</span>}>
                    <p className="text-lg text-center text-[var(--foreground)]/90">
                        Too many are confused by choices.<br />
                        We believe the true power of AI lies not in abundance, but in <span className="text-[var(--primary)] font-semibold">alignment</span> — in knowing what to use, when to use it, and why it matters.<br />
                        <span className="block mt-4 text-[var(--primary)] font-bold">Linchpin is here to change that.</span>
                    </p>
                </CalloutCard>

                {/* Animated divider */}
                <motion.div
                    initial={{ scaleX: 0 }}
                    whileInView={{ scaleX: 1 }}
                    transition={{ delay: 0.2, duration: 0.9, type: "spring" }}
                    className="w-24 h-1 rounded-full mx-auto my-10"
                    style={{
                        background: "linear-gradient(90deg, var(--primary), var(--secondary), var(--primary))",
                    }}
                />

                <div className="relative z-10 mb-8">
                    <motion.ul
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true }}
                        variants={{
                            hidden: { opacity: 0, y: 24 },
                            visible: {
                                opacity: 1, y: 0,
                                transition: { staggerChildren: 0.19, delayChildren: 0.1 },
                            },
                        }}
                        className="space-y-5 text-center text-lg md:text-xl font-medium text-[var(--primary)]"
                    >
                        <motion.li variants={{ hidden: {}, visible: {} }}>
                            <span className="font-semibold">This is where complexity meets clarity.</span>
                        </motion.li>
                        <motion.li variants={{ hidden: {}, visible: {} }}>
                            <span className="font-semibold">Where scattered possibilities become unified power.</span>
                        </motion.li>
                        <motion.li variants={{ hidden: {}, visible: {} }}>
                            <span className="font-semibold">Where you don’t need to find the needle — because we built the compass.</span>
                        </motion.li>
                    </motion.ul>
                </div>

                <CalloutCard icon={<span className="text-3xl">🚀</span>}>
                    <p className="text-lg text-center text-[var(--foreground)]/90">
                        At Linchpin, we envision a future where AI is not just a tool, but an extension of human creativity and ambition — a force that amplifies rather than confuses.<br />
                        <span className="text-[var(--secondary)] font-semibold block mt-2">Linchpin is that future’s gateway.</span>
                        <br />
                        We help creators, developers, entrepreneurs, and visionaries discover, compare, and connect with the right AI solutions — not by chance, but with purpose.
                    </p>
                </CalloutCard>

                <CalloutCard icon={<span className="text-3xl">🌐</span>}>
                    <p className="text-lg text-center text-[var(--foreground)]/90">
                        We’re building more than a directory.<br />
                        <b className="text-[var(--primary)]">Linchpin is your intelligent gateway</b> — a curated, ever-evolving ecosystem that brings the right tools to your fingertips.
                    </p>
                </CalloutCard>

                <motion.h3
                    initial={{ opacity: 0, y: 16 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.15, duration: 0.8, type: "spring" }}
                    className="text-xl md:text-2xl font-semibold text-[var(--secondary)] mt-12 mb-2 text-center"
                >
                    Our mission is bold:
                </motion.h3>
                <motion.p
                    initial={{ opacity: 0, y: 14 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.22, duration: 0.7, type: "spring" }}
                    className="text-lg md:text-xl text-center mb-8 text-[var(--foreground)]"
                >
                    To unify the fragmented AI landscape into a seamless, empowering experience.
                </motion.p>
                <motion.ul
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                    variants={{
                        hidden: { opacity: 0, y: 16 },
                        visible: {
                            opacity: 1, y: 0,
                            transition: { staggerChildren: 0.16, delayChildren: 0.1 },
                        },
                    }}
                    className="list-none mt-2 mb-8 text-lg md:text-xl text-center space-y-1 text-[var(--secondary)]"
                >
                    <motion.li className="font-semibold" variants={{ hidden: {}, visible: {} }}>For creators.</motion.li>
                    <motion.li className="font-semibold" variants={{ hidden: {}, visible: {} }}>For builders.</motion.li>
                    <motion.li className="font-semibold" variants={{ hidden: {}, visible: {} }}>For dreamers.</motion.li>
                    <motion.li className="font-semibold" variants={{ hidden: {}, visible: {} }}>For anyone ready to harness AI — without the friction.</motion.li>
                </motion.ul>

                {/* Final closing callout */}
                <CalloutCard icon={<span className="text-3xl">✨</span>}>
                    <p className="text-lg text-center text-[var(--foreground)]/90">
                        Linchpin is where <span className="font-semibold text-[var(--primary)]">noise becomes signal</span>.<br />
                        Where <span className="font-semibold text-[var(--primary)]">confusion becomes clarity</span>.<br />
                        Where <span className="font-semibold text-[var(--primary)]">complexity becomes connected intelligence</span>.
                        <br /><br />
                        This isn’t just a platform.<br />
                        <span className="italic">It’s a movement.</span>
                        <br />
                        And at the heart of it all stands <span className="font-bold text-[var(--primary)]">Linchpin by Sarvaarth Multinational</span> —
                        <br />
                        <span className="font-extrabold text-[var(--primary)] text-2xl block mt-2">the world’s AI nexus.</span>
                    </p>
                </CalloutCard>
            </section>
            <div className="pb-20">
                <Logo className="w-90 sm:w-100 h-auto opacity-80 hover:opacity-100 transition-opacity" />
            </div>
        </main>
    );
}