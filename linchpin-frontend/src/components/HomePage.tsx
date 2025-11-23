'use client';

import { Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import BestInCategorySection from './BestInCategorySection';
import { BackgroundBeams } from './ui/background-beams';
import AboutAISection from './AboutAISection';
import { AIToolsProvider } from '@/context/AIToolsContext';

export default function HomePage() {
    const router = useRouter();
    const [search, setSearch] = useState("");
    const [placeholder, setPlaceholder] = useState("Search for AI tools, categories, features...");

    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth < 768) {
                setPlaceholder("Search for AI tools...");
            } else {
                setPlaceholder("Search for AI tools, categories, features...");
            }
        };

        // Initial check
        handleResize();

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const handleSearch = () => {
        router.push(`/ai-tools?search=${encodeURIComponent(search)}`);
    };

    const sections = [
        { title: "Best in Productivity", category: "Productivity" },
        { title: "Best in Content Creation", category: "Content Creation" },
        { title: "Best in Developer Tools", category: "Developer Tools" },
    ];

    return (
        <AIToolsProvider>
            <section
                className="relative flex flex-col items-center justify-center w-full py-20 md:py-32 px-4 text-center overflow-hidden min-h-[750px]"
            >
                <BackgroundBeams className="absolute inset-0" />

                <div className="relative z-20 flex flex-col items-center justify-center w-full h-full">
                    <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-8 bg-clip-text text-transparent bg-gradient-to-b from-neutral-500 to-neutral-600 dark:from-neutral-100 dark:to-neutral-400">
                        Discover the Best AI Tools
                    </h1>
                    {/* Search Bar */}
                    <div className="w-full max-w-2xl relative mb-9">
                        <Input
                            type="search"
                            placeholder={placeholder}
                            className="w-full h-12 md:h-14 pl-6 pr-12 rounded-full text-base backdrop-blur-md bg-white/5 dark:bg-black/5 border-white/10 focus:border-primary/50 transition-all duration-300 shadow-lg hover:bg-white/10 dark:hover:bg-black/10"
                            value={search}
                            onChange={e => setSearch(e.target.value)}
                            onKeyDown={e => e.key === "Enter" && handleSearch()}
                        />
                        <Search className="absolute right-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                    </div>
                    <Button
                        size="lg"
                        className="px-8 py-6 text-xl rounded-full shadow-lg hover:shadow-xl transition-all duration-300 bg-gradient-to-r from-primary via-primary to-secondary hover:opacity-90 border-0"
                        onClick={handleSearch}
                    >
                        Search AI Tools
                    </Button>
                </div>
            </section>
            {/* Render a section for each category */}
            {sections.map(({ title, category }) => (
                <BestInCategorySection
                    key={category}
                    title={title}
                    category={category}
                />
            ))}
            <AboutAISection />
        </AIToolsProvider>
    );
}