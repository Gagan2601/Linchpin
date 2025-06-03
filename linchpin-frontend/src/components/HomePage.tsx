'use client';

import { Search, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useEffect, useRef } from 'react';
import { Card, CardContent, CardTitle } from '@/components/ui/card';
import { Vortex } from './ui/vortex';

export default function HomePage() {
    const scrollRef = useRef<HTMLDivElement>(null);

    // Categories data (5 items as requested)
    const categories = [
        { id: 1, category: 'Text Generation' },
        { id: 2, category: 'Image Creation' },
        { id: 3, category: 'Video Editing' },
        { id: 4, category: 'Code Assistance' },
        { id: 5, category: 'Voice Synthesis' },
    ];

    useEffect(() => {
        const scrollContainer = scrollRef.current;
        if (!scrollContainer) return;

        // Clone the first few items and append to end for seamless looping
        const firstFewItems = Array.from(scrollContainer.children).slice(0, 3);
        firstFewItems.forEach(item => {
            const clone = item.cloneNode(true);
            scrollContainer.appendChild(clone);
        });

        let animationFrameId: number;
        const speed = 1;
        let scrollPosition = 0;
        let isScrolling = true;

        const animate = () => {
            if (isScrolling) {
                scrollPosition += speed;
                scrollContainer.scrollLeft = scrollPosition;

                // Reset to start when reaching the end of original items
                if (scrollPosition >= scrollContainer.scrollWidth / 2) {
                    scrollPosition = 0;
                    scrollContainer.scrollLeft = 0;
                }
            }
            animationFrameId = requestAnimationFrame(animate);
        };

        animationFrameId = requestAnimationFrame(animate);

        // Pause on hover
        const handleMouseEnter = () => isScrolling = false;
        const handleMouseLeave = () => isScrolling = true;

        scrollContainer.addEventListener('mouseenter', handleMouseEnter);
        scrollContainer.addEventListener('mouseleave', handleMouseLeave);

        return () => {
            cancelAnimationFrame(animationFrameId);
            scrollContainer.removeEventListener('mouseenter', handleMouseEnter);
            scrollContainer.removeEventListener('mouseleave', handleMouseLeave);
        };
    }, []);

    return (
        <>
            {/* Hero Section with Grid Background */}
            <section
                className="flex flex-col items-center justify-center w-full py-20 md:py-32 px-4 text-center relative overflow-hidden"
            >
                <Vortex
                    backgroundColor="transparent"
                    baseHue={260} // Purple base
                    rangeHue={150} // Allows both purples and teals
                    saturation={100}
                    lightness={59}
                    particleCount={600}
                    className="flex items-center flex-col justify-center px-2 md:px-10 py-4 w-full h-full"
                >
                    <div className="relative z-10">
                        <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-8">
                            Discover the Best AI Tools
                        </h1>

                        {/* Search Bar */}
                        <div className="w-full max-w-2xl relative mb-4">
                            <Input
                                type="search"
                                placeholder="Search for AI tools, categories, features..."
                                className="w-full h-12 md:h-14 pl-4 pr-12 rounded-lg text-base backdrop-blur-sm bg-background/80"
                            />
                            <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                        </div>

                        <Button size="lg" className="px-8 py-6 text-md">
                            Search AI Tools
                        </Button>
                    </div>
                </Vortex>
            </section>

            {/* Best in Category Section */}
            <section className="w-full py-12 px-4 md:px-6">
                <div className="flex items-center justify-between mb-8">
                    <h2 className="text-2xl md:text-3xl font-bold">Best in Category</h2>
                    <Button variant="link" className="flex items-center gap-1 p-0 text-primary text-lg">
                        Show All
                        <ArrowRight className="h-4 w-4" />
                    </Button>
                </div>

                <div
                    ref={scrollRef}
                    className="flex overflow-x-hidden gap-6 py-4"
                >
                    {categories.map((item) => (
                        <Card
                            key={item.id}
                            className="flex-shrink-0 w-80 h-60 md:w-96 md:h-72 bg-gradient-to-br from-primary/10 to-secondary/10 flex items-center justify-center hover:shadow-lg transition-shadow"
                        >
                            <CardContent className="text-center p-6">
                                <CardTitle className="text-3xl md:text-4xl">{item.category}</CardTitle>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </section>
        </>
    );
}