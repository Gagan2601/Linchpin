'use client';

import { Brain } from "lucide-react";



export default function AboutAISection() {
    return (
        <section className="relative w-full min-h-screen overflow-hidden bg-background flex items-center justify-center">
            {/* CSS-based Animated Background */}
            <div className="absolute inset-0 w-full h-full overflow-hidden z-0 pointer-events-none">
                {/* Grid Pattern with better visibility */}
                <div className="absolute inset-0 bg-grid-pattern opacity-[0.5] dark:opacity-[0.65]" />

                {/* Floating Orbs - Enhanced for better coverage */}
                <div className="absolute top-0 left-0 w-[800px] h-[800px] bg-primary/20 rounded-full blur-[120px] animate-float opacity-50 dark:opacity-30" />
                <div className="absolute bottom-0 right-0 w-[800px] h-[800px] bg-secondary/20 rounded-full blur-[120px] animate-float-delayed opacity-50 dark:opacity-30" />
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[1000px] h-[1000px] bg-accent/5 rounded-full blur-[150px] opacity-20" />
            </div>

            {/* Content */}
            <div className="relative z-10 w-full max-w-8xl mx-auto px-6 md:px-12 lg:px-24 py-20">
                <div className="grid lg:grid-cols-2 gap-12 items-center">
                    <div className="text-left">
                        {/* Eyebrow */}
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 mb-6 backdrop-blur-sm">
                            <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                            <p className="text-xs font-bold tracking-widest uppercase text-primary">
                                The AI Library
                            </p>
                        </div>

                        {/* Headline */}
                        <h2 className="text-5xl md:text-7xl font-bold mb-6 tracking-tight leading-tight">
                            <span className="text-gray-900 dark:text-white">Every AI tool,</span>
                            <br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-purple-500 to-secondary animate-gradient-x">
                                in one place.
                            </span>
                        </h2>

                        {/* Subhead */}
                        <p className="text-xl md:text-2xl mb-10 leading-relaxed text-gray-700 dark:text-gray-100">
                            Linchpin helps you <span className="text-primary font-semibold">discover</span>,
                            <span className="text-secondary font-semibold"> compare</span>, and{" "}
                            <span className="text-accent-foreground font-semibold">use</span> the best AI tools —
                            complete with clear profiles, real limits, and practical workflows.
                        </p>

                        {/* Value bullets */}
                        <div className="space-y-6">
                            <ul className="grid gap-5">
                                {[
                                    { label: "Discover", text: "Search the web’s AI tools with clean, consistent profiles." },
                                    { label: "Deep-dive", text: "Models, pricing, limits, privacy, integrations, and changelogs." },
                                    { label: "Compare", text: "Side-by-side views to pick the right fit for your use case." },
                                    { label: "Apply", text: "Ready-to-use prompts, recipes, and workflow notes." },
                                    { label: "Community", text: "Share stacks, follow creators, and learn together (soon)." },
                                ].map((item, i) => (
                                    <li key={i} className="flex items-start gap-4 group">
                                        <div className="mt-1.5 w-6 h-6 rounded-full bg-secondary/10 flex items-center justify-center flex-shrink-0 group-hover:bg-secondary/20 transition-colors">
                                            <div className="w-2 h-2 rounded-full bg-secondary" />
                                        </div>
                                        <div className="text-gray-700 dark:text-gray-200">
                                            <span className="font-bold text-lg text-gray-900 dark:text-white">{item.label}:</span>
                                            <span className="ml-1 text-lg opacity-90">{item.text}</span>
                                        </div>
                                    </li>
                                ))}
                            </ul>

                            <p className="text-lg font-medium pt-4 text-gray-600 dark:text-gray-300">
                                Less noise. More signal. Linchpin makes AI practical.
                            </p>
                        </div>
                    </div>

                    {/* Decorative Element: AI Network Visualization */}
                    <div className="hidden lg:block relative h-[700px] w-full">
                        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-secondary/10 rounded-full blur-3xl transform scale-125 opacity-50" />

                        {/* Central Hub */}
                        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-20">
                            <div className="relative w-48 h-48 bg-background rounded-[2.5rem] border border-primary/30 shadow-glow-primary flex items-center justify-center z-20">
                                <div className="absolute inset-0 bg-primary/10 rounded-[2.5rem] animate-pulse" />
                                <Brain className="w-24 h-24 text-primary" />
                            </div>
                            {/* Pulse Rings */}
                            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-72 h-72 border border-primary/20 rounded-full animate-ping opacity-20" />
                            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 border border-primary/10 rounded-full animate-pulse opacity-20" />
                        </div>

                        {/* Orbiting Nodes */}
                        {[
                            { icon: "M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3M3.343 19.05l.707-.707M18.364 19.05l-.707-.707M9 21v-1", label: "Models", delay: "0s", x: "translate-x-60 -translate-y-48", color: "text-blue-500", bg: "bg-blue-500/10" },
                            { icon: "M13 10V3L4 14h7v7l9-11h-7z", label: "Speed", delay: "2s", x: "translate-x-48 translate-y-60", color: "text-yellow-500", bg: "bg-yellow-500/10" },
                            { icon: "M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z", label: "Pricing", delay: "4s", x: "-translate-x-60 translate-y-32", color: "text-green-500", bg: "bg-green-500/10" },
                            { icon: "M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z", label: "Community", delay: "6s", x: "-translate-x-36 -translate-y-60", color: "text-purple-500", bg: "bg-purple-500/10" },
                        ].map((node, i) => (
                            <div key={i} className={`absolute top-1/2 left-1/2 transform ${node.x} z-10 animate-float`} style={{ animationDelay: node.delay }}>
                                <div className={`relative w-20 h-20 bg-white dark:bg-gray-900 rounded-2xl border border-white/10 shadow-lg flex items-center justify-center group hover:scale-110 transition-transform duration-300`}>
                                    <div className={`absolute inset-0 ${node.bg} rounded-2xl opacity-50 group-hover:opacity-100 transition-opacity`} />
                                    <svg className={`w-10 h-10 ${node.color}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d={node.icon} />
                                    </svg>
                                    {/* Connection Line to Center */}
                                    <div className="absolute top-1/2 left-1/2 w-40 h-[1px] bg-gradient-to-r from-transparent via-primary/20 to-transparent transform -translate-x-1/2 -translate-y-1/2 -z-10 rotate-45" />
                                </div>
                                <div className="absolute -bottom-10 left-1/2 transform -translate-x-1/2 text-base font-medium text-gray-600 dark:text-gray-400">
                                    {node.label}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}
