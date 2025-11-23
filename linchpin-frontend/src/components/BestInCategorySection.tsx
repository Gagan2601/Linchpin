'use client';

import { useMemo, useState, useRef } from "react";
import { Card, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Globe } from "lucide-react";
import { useRouter } from "next/navigation";
import { AITool, getProxiedLogoUrl } from "@/services/ai";
import { useAITools } from "@/context/AIToolsContext";
import Image from "next/image";

interface Props {
    title: string;
    category: string;
    showAllLink?: string;
    max?: number;
}

interface ToolLogoProps {
    tool: AITool;
    className?: string;
    onImageError?: () => void;
}

function ToolLogo({ tool, className, onImageError }: ToolLogoProps) {
    const [imgFailed, setImgFailed] = useState(false);
    const proxiedLogoUrl = getProxiedLogoUrl(tool.logo_url);
    const defaultClass = "w-40 h-40 object-contain rounded-4xl border bg-white";

    if (proxiedLogoUrl && !imgFailed) {
        return (
            <Image
                src={proxiedLogoUrl}
                alt={tool.name}
                width={100}
                height={100}
                className={className || defaultClass}
                onError={() => {
                    setImgFailed(true);
                    onImageError?.();
                }}
                loading="lazy"
                unoptimized
            />
        );
    }
    return (
        <div className={`${className || "w-40 h-40"} rounded-4xl bg-muted flex items-center justify-center text-3xl font-bold`}>
            {tool.name[0]}
        </div>
    );
}

// Helper to repeat an array n times - REMOVED as unused

export default function BestInCategorySection({
    title,
    category,
    showAllLink,
    max = 10,
}: Props) {
    const router = useRouter();
    const { tools: allTools, loading } = useAITools();
    const [brokenLogos, setBrokenLogos] = useState<Record<string, boolean>>({});

    const finalShowAllLink = showAllLink || `/ai-tools?category=${encodeURIComponent(category)}`;

    // Memoize filtered and sorted tools
    const tools = useMemo(() => {
        const hasValidLogo = (tool: AITool) =>
            !!tool.logo_url &&
            tool.logo_url.trim().length > 0 &&
            !brokenLogos[tool._id];

        return allTools
            .filter((tool) => tool.categories?.includes(category))
            .sort((a, b) => {
                const aHasLogo = hasValidLogo(a);
                const bHasLogo = hasValidLogo(b);

                if (aHasLogo && !bHasLogo) return -1;
                if (!aHasLogo && bHasLogo) return 1;

                // Secondary sort by rating
                return (b.total_rating ?? 0) - (a.total_rating ?? 0);
            })
            .slice(0, max);
    }, [allTools, category, max, brokenLogos]);

    const scrollContainerRef = useRef<HTMLDivElement>(null);
    const [isDragging, setIsDragging] = useState(false);
    const startX = useRef(0);
    const scrollLeft = useRef(0);
    const velX = useRef(0);
    const lastTime = useRef(0);
    const lastX = useRef(0);
    const animationRef = useRef<number | null>(null);

    const handleMouseDown = (e: React.MouseEvent) => {
        if (!scrollContainerRef.current) return;
        setIsDragging(true);
        startX.current = e.pageX - scrollContainerRef.current.offsetLeft;
        scrollLeft.current = scrollContainerRef.current.scrollLeft;
        lastX.current = e.pageX;
        lastTime.current = Date.now();
        velX.current = 0;
        if (animationRef.current) {
            cancelAnimationFrame(animationRef.current);
            animationRef.current = null;
        }
    };

    const handleMouseLeave = () => {
        if (isDragging) {
            setIsDragging(false);
            beginMomentum();
        }
    };

    const handleMouseUp = () => {
        setIsDragging(false);
        beginMomentum();
    };

    const handleMouseMove = (e: React.MouseEvent) => {
        if (!isDragging || !scrollContainerRef.current) return;
        e.preventDefault();
        const x = e.pageX - scrollContainerRef.current.offsetLeft;
        const walk = (x - startX.current) * 1.5;
        scrollContainerRef.current.scrollLeft = scrollLeft.current - walk;

        // Calculate velocity with simple smoothing
        const now = Date.now();
        const dt = now - lastTime.current;
        if (dt > 0) {
            const dx = e.pageX - lastX.current;
            const newVel = dx / dt;
            // Smooth velocity: 80% new, 20% old to reduce jitter
            velX.current = newVel * 0.8 + velX.current * 0.2;
            lastX.current = e.pageX;
            lastTime.current = now;
        }
    };

    const beginMomentum = () => {
        if (animationRef.current) cancelAnimationFrame(animationRef.current);

        const momentumLoop = () => {
            if (!scrollContainerRef.current) return;

            // Apply friction
            velX.current *= 0.95;

            if (Math.abs(velX.current) > 0.01) {
                scrollContainerRef.current.scrollLeft -= velX.current * 12; // Adjusted multiplier
                animationRef.current = requestAnimationFrame(momentumLoop);
            } else {
                animationRef.current = null;
                // Re-enable snap after momentum stops (optional, but might be jarring if it snaps immediately)
                // For now, we keep snap disabled during interaction to avoid conflict
            }
        };
        animationRef.current = requestAnimationFrame(momentumLoop);
    };

    const handleLogoError = (toolId: string) => {
        setBrokenLogos(prev => {
            if (prev[toolId]) return prev;
            return { ...prev, [toolId]: true };
        });
    };

    // Render the cards with Flip Effect
    const renderTools = () =>
        tools.map((tool, idx) => (
            <div
                key={`${tool._id}-${idx}`}
                className="group perspective-1000 w-[85vw] sm:w-80 md:w-96 h-80 flex-shrink-0 cursor-pointer snap-center"
                onClick={() => {
                    // Prevent click if we just dragged
                    if (!isDragging && Math.abs(velX.current) < 0.1) {
                        router.push(`/ai-tools/${tool._id}`);
                    }
                }}
            >
                <div className="relative w-full h-full transition-transform duration-500 transform-style-3d group-hover:rotate-y-180">
                    {/* Front Side */}
                    <Card className="absolute inset-0 w-full h-full backface-hidden bg-white/5 backdrop-blur-md border border-white/10 flex flex-col items-center justify-center p-6 shadow-xl overflow-hidden">
                        <div className="mt-6 mb-2 transform transition-transform duration-300 group-hover:scale-110 relative z-10 flex items-center justify-center w-full">
                            {/* Glow Effect - Increased size and opacity */}
                            <div className="absolute w-56 h-56 bg-primary/40 rounded-full blur-3xl -z-10 group-hover:bg-primary/50 transition-colors duration-500" />
                            <ToolLogo tool={tool} onImageError={() => handleLogoError(tool._id)} />
                        </div>
                        <CardTitle className="text-2xl font-bold text-center bg-clip-text text-transparent bg-gradient-to-r from-foreground to-foreground/70 relative z-10">
                            {tool.name}
                        </CardTitle>
                    </Card>

                    {/* Back Side */}
                    <Card className="absolute inset-0 w-full h-full backface-hidden rotate-y-180 bg-gradient-to-br from-primary/10 to-secondary/10 backdrop-blur-md border border-primary/20 flex flex-col items-center justify-center p-4 shadow-glow-primary text-center">
                        <div className="mb-2">
                            <ToolLogo tool={tool} className="w-14 h-14 object-contain rounded-2xl border" />
                        </div>
                        <h3 className="text-lg font-bold mb-1 text-foreground">{tool.name}</h3>
                        <p className="text-sm text-muted-foreground line-clamp-6 mb-3 leading-relaxed">
                            {tool.description}
                        </p>
                        <Button
                            className="rounded-full bg-primary hover:bg-primary/90 text-white shadow-lg transform active:scale-95 transition-all"
                            onClick={(e) => {
                                e.stopPropagation();
                                window.open(tool.website, '_blank');
                            }}
                        >
                            <Globe className="w-4 h-4 mr-2" />
                            Visit Website
                        </Button>
                    </Card>
                </div>
            </div>
        ));

    if (!loading && tools.length === 0) return null;

    return (
        <section className="w-full py-10">
            <div className="container mx-auto px-4 md:px-6 mb-10 flex items-center justify-between">
                <h2 className="text-3xl md:text-4xl font-bold tracking-tight">
                    {title}
                </h2>
                <Button
                    variant="ghost"
                    className="group flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors"
                    onClick={() => router.push(finalShowAllLink)}
                >
                    View All
                    <span className="block transition-transform group-hover:translate-x-1">→</span>
                </Button>
            </div>

            <div className="relative w-full">
                {/* Scroll Container */}
                <div
                    ref={scrollContainerRef}
                    className={`flex overflow-x-auto gap-6 md:gap-8 py-8 px-4 md:px-12 scrollbar-hide touch-pan-x ${isDragging ? 'cursor-grabbing snap-none' : 'cursor-grab snap-x snap-proximity'
                        }`}
                    onMouseDown={handleMouseDown}
                    onMouseLeave={handleMouseLeave}
                    onMouseUp={handleMouseUp}
                    onMouseMove={handleMouseMove}
                >
                    {loading ? (
                        Array.from({ length: max }).map((_, i) => (
                            <div key={i} className="w-[85vw] sm:w-80 md:w-96 h-80 flex-shrink-0 bg-muted/20 rounded-xl animate-pulse border border-white/5 snap-center" />
                        ))
                    ) : (
                        renderTools()
                    )}
                </div>
            </div>
            <style jsx>{`
                .scrollbar-hide::-webkit-scrollbar {
                    display: none;
                }
                .scrollbar-hide {
                    -ms-overflow-style: none;
                    scrollbar-width: none;
                }
            `}</style>
        </section>
    );
}