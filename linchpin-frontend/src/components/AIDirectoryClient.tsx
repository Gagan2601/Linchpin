'use client';

import { useEffect, useState, useMemo } from "react";
import { aiService, AITool, getProxiedLogoUrl } from "@/services/ai";
import { Input } from "@/components/ui/input";
import { Star, TrendingUp, Globe, ChevronDown } from "lucide-react";
import { useSearchParams } from "next/navigation";
import Image from "next/image";
import LoadingAIDirectorySkeleton from "@/components/skeleton/LoadingAIDirectory";

// Helper: get all unique categories
const getUniqueCategories = (tools: AITool[]) =>
    Array.from(new Set(tools.flatMap((t) => t.categories ?? []))).filter(Boolean);

// Helper: extract timestamp from MongoDB ObjectId
function getTimestampFromObjectId(objectId: string): number {
    if (!/^[a-fA-F0-9]{24}$/.test(objectId)) return 0;
    return parseInt(objectId.substring(0, 8), 16) * 1000;
}

// Helper: get timestamp for sorting
function getToolTimestamp(tool: AITool): number {
    if ('createdAt' in tool && tool.createdAt) return +new Date(tool.createdAt);
    if (tool._id && typeof tool._id === 'string' && tool._id.length >= 8) {
        return getTimestampFromObjectId(tool._id);
    }
    return 0;
}

// Sorting options
const SORT_OPTIONS = [
    { value: "latest", label: "Latest Added (Default)" },
    { value: "oldest", label: "Oldest First" },
    { value: "alpha-asc", label: "A-Z" },
    { value: "alpha-desc", label: "Z-A" },
    { value: "rating-desc", label: "Top Rated" },
    { value: "rating-asc", label: "Lowest Rated" },
];

const PAGE_SIZE = 15;

export default function AIDirectoryClient() {
    const searchParams = useSearchParams();
    const searchParamFromUrl = searchParams.get("search") || "";
    const categoryParamFromUrl = searchParams.get("category") || null;

    const [tools, setTools] = useState<AITool[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [search, setSearch] = useState(searchParamFromUrl);
    const [category, setCategory] = useState<string | null>(categoryParamFromUrl);
    const [categoryDropdownOpen, setCategoryDropdownOpen] = useState(false);
    const [sortDropdownOpen, setSortDropdownOpen] = useState(false);
    const [sortBy, setSortBy] = useState("latest");
    const [page, setPage] = useState(1);

    // Sync search/category with URL
    useEffect(() => setSearch(searchParamFromUrl), [searchParamFromUrl]);
    useEffect(() => setCategory(categoryParamFromUrl), [categoryParamFromUrl]);

    useEffect(() => {
        setLoading(true);
        aiService.getAllAITools().then((res) => {
            if (res.data) {
                setTools(res.data);
                setError(null);
            } else {
                setError(res.error || "Failed to load AI tools.");
            }
            setLoading(false);
        });
    }, []);

    const categories = useMemo(() => getUniqueCategories(tools), [tools]);

    // Filtering & Sorting
    const filtered = useMemo(() => {
        let filtered = tools;
        if (search) {
            const s = search.toLowerCase();
            filtered = filtered.filter(
                (t) =>
                    t.name.toLowerCase().includes(s) ||
                    (t.description?.toLowerCase().includes(s) ?? false)
            );
        }
        if (category) {
            filtered = filtered.filter((t) => t.categories?.includes(category));
        }
        // Sorting
        switch (sortBy) {
            case "alpha-asc":
                filtered = [...filtered].sort((a, b) =>
                    a.name.localeCompare(b.name)
                );
                break;
            case "alpha-desc":
                filtered = [...filtered].sort((a, b) =>
                    b.name.localeCompare(a.name)
                );
                break;
            case "oldest":
                filtered = [...filtered].sort(
                    (a, b) => getToolTimestamp(a) - getToolTimestamp(b)
                );
                break;
            case "latest":
                filtered = [...filtered].sort(
                    (a, b) => getToolTimestamp(b) - getToolTimestamp(a)
                );
                break;
            case "rating-desc":
                filtered = [...filtered].sort(
                    (a, b) => (b.total_rating ?? 0) - (a.total_rating ?? 0)
                );
                break;
            case "rating-asc":
                filtered = [...filtered].sort(
                    (a, b) => (a.total_rating ?? 0) - (b.total_rating ?? 0)
                );
                break;
        }
        return filtered;
    }, [tools, search, category, sortBy]);

    // Pagination
    const totalPages = Math.ceil(filtered.length / PAGE_SIZE);
    const paginated = useMemo(
        () => filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE),
        [filtered, page]
    );

    // Reset page to 1 when filters change
    useEffect(() => setPage(1), [search, category, sortBy]);

    // Logo fallback as component
    function ToolLogo({ tool }: { tool: AITool }) {
        const [imgFailed, setImgFailed] = useState(false);
        const proxiedLogoUrl = getProxiedLogoUrl(tool.logo_url);

        if (proxiedLogoUrl && !imgFailed) {
            return (
                <Image
                    src={proxiedLogoUrl}
                    alt={tool.name}
                    width={56}
                    height={56}
                    className="w-14 h-14 object-contain rounded-lg border bg-white"
                    onError={() => setImgFailed(true)}
                    loading="lazy"
                    unoptimized
                />
            );
        }
        return (
            <div className="w-14 h-14 rounded-lg bg-muted flex items-center justify-center text-2xl font-bold">
                {tool.name[0]}
            </div>
        );
    }

    if (loading) {
        // Skeleton at the outermost level
        return <LoadingAIDirectorySkeleton />;
    }

    return (
        <div className="w-full min-h-screen bg-background">
            {/* Hero / Header Section */}
            <div className="relative w-full pt-40 pb-10 px-4 md:px-8 overflow-hidden">
                <div className="absolute inset-0 bg-grid-pattern opacity-[0.03] dark:opacity-[0.07] pointer-events-none" />
                <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl animate-float pointer-events-none" />
                <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-secondary/10 rounded-full blur-3xl animate-float-delayed pointer-events-none" />

                <div className="max-w-[95%] mx-auto relative z-10 text-center">
                    <h1 className="text-4xl md:text-6xl font-bold mb-6 tracking-tight">
                        AI Tools <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary">Directory</span>
                    </h1>
                    <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-10">
                        Discover, compare, and find the perfect AI tools for your workflow.
                    </p>
                </div>
            </div>

            {/* Main Content */}
            <div className="max-w-[95%] mx-auto px-4 md:px-8 pb-20">
                {/* Search & Filter Bar */}
                <div className="sticky top-4 z-40">
                    <div className="max-w-4xl mx-auto bg-white/5 backdrop-blur-xl border border-white/10 rounded-4xl sm:rounded-full p-4 shadow-2xl">
                        <div className="flex flex-col md:flex-row gap-4">
                            <div className="flex-1 relative">
                                <Input
                                    placeholder="Search AI tools..."
                                    className="w-full bg-background/50 border-white/10 focus:border-primary/50 h-12 pl-4 text-lg rounded-full"
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                />
                            </div>
                            <div className="flex gap-3 flex-wrap pb-2 md:pb-0">
                                {/* Category Dropdown */}
                                <div className="relative min-w-[140px]">
                                    <button
                                        className={
                                            "w-full flex items-center justify-between gap-2 px-4 h-12 rounded-full border bg-background/50 text-sm font-medium hover:bg-accent/50 transition whitespace-nowrap "
                                            + (category ? "border-primary/50 text-primary" : "border-white/10")
                                        }
                                        onClick={() => setCategoryDropdownOpen((open) => !open)}
                                        type="button"
                                    >
                                        <span className="truncate">{category || "All Categories"}</span>
                                        <ChevronDown className="w-4 h-4 flex-shrink-0" />
                                    </button>
                                    {categoryDropdownOpen && (
                                        <div className="absolute left-0 md:right-0 z-50 mt-2 w-56 bg-popover/95 backdrop-blur-xl border border-border rounded-3xl shadow-xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
                                            <div className="p-2 max-h-64 overflow-y-auto custom-scrollbar">
                                                <button
                                                    className={"w-full text-left px-3 py-2 rounded-xl text-sm transition-colors " + (!category ? "bg-primary/10 text-primary font-medium" : "hover:bg-accent")}
                                                    onClick={() => { setCategory(null); setCategoryDropdownOpen(false); }}
                                                >
                                                    All Categories
                                                </button>
                                                {categories.map((cat) => (
                                                    <button
                                                        key={cat}
                                                        className={"w-full text-left px-3 py-2 rounded-xl text-sm transition-colors " + (category === cat ? "bg-primary/10 text-primary font-medium" : "hover:bg-accent")}
                                                        onClick={() => { setCategory(cat); setCategoryDropdownOpen(false); }}
                                                    >
                                                        {cat}
                                                    </button>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </div>

                                {/* Sort Dropdown */}
                                <div className="relative min-w-[140px]">
                                    <button
                                        className="w-full flex items-center justify-between gap-2 px-4 h-12 rounded-full border border-white/10 bg-background/50 text-sm font-medium hover:bg-accent/50 transition whitespace-nowrap"
                                        onClick={() => setSortDropdownOpen(open => !open)}
                                        type="button"
                                    >
                                        <span className="truncate">{SORT_OPTIONS.find(opt => opt.value === sortBy)?.label}</span>
                                        <ChevronDown className="w-4 h-4 flex-shrink-0" />
                                    </button>
                                    {sortDropdownOpen && (
                                        <div className="absolute left-0 md:right-0 z-50 mt-2 w-56 bg-popover/95 backdrop-blur-xl border border-border rounded-3xl shadow-xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
                                            <div className="p-2">
                                                {SORT_OPTIONS.map(opt => (
                                                    <button
                                                        key={opt.value}
                                                        className={"w-full text-left px-3 py-2 rounded-xl text-sm transition-colors " + (sortBy === opt.value ? "bg-primary/10 text-primary font-medium" : "hover:bg-accent")}
                                                        onClick={() => { setSortBy(opt.value); setSortDropdownOpen(false); }}
                                                    >
                                                        {opt.label}
                                                    </button>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Tools Grid */}
            <div className="max-w-[95%] mx-auto px-4 md:px-8 pb-20">
                {error && <div className="text-destructive py-8 text-center bg-destructive/10 rounded-3xl mb-8">{error}</div>}

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {!loading && paginated.length === 0 && (
                        <div className="col-span-full text-center py-20">
                            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-muted mb-4">
                                <Globe className="w-8 h-8 text-muted-foreground" />
                            </div>
                            <h3 className="text-xl font-semibold mb-2">No tools found</h3>
                            <p className="text-muted-foreground">Try adjusting your search or filters.</p>
                        </div>
                    )}
                    {paginated.map((tool) => (
                        <div
                            key={tool._id}
                            className="group relative bg-card hover:bg-accent/5 border border-border/50 hover:border-primary/30 rounded-3xl overflow-hidden transition-all duration-300 hover:shadow-glow-primary hover:-translate-y-1 cursor-pointer flex flex-col h-full"
                            onClick={() => window.location.href = `/ai-tools/${tool._id}`}
                        >
                            <div className="p-5 flex-1 flex flex-col">
                                <div className="flex items-start justify-between mb-4">
                                    <ToolLogo tool={tool} />
                                    {tool.trending && (
                                        <div className="px-2 py-1 rounded-full bg-orange-500/10 text-orange-500 text-xs font-medium flex items-center gap-1">
                                            <TrendingUp className="w-3 h-3" />
                                            Trending
                                        </div>
                                    )}
                                </div>

                                <h3 className="text-lg font-bold mb-2 group-hover:text-primary transition-colors line-clamp-1">
                                    {tool.name}
                                </h3>

                                <p className="text-sm text-muted-foreground mb-4 line-clamp-2 flex-1">
                                    {tool.description}
                                </p>

                                <div className="flex flex-wrap gap-2 mb-4">
                                    {tool.categories?.slice(0, 2).map((c) => (
                                        <span key={c} className="px-2 py-1 rounded-md bg-neutral-100 text-neutral-900 dark:bg-neutral-800 dark:text-white text-xs font-medium border border-neutral-200 dark:border-neutral-700">
                                            {c}
                                        </span>
                                    ))}
                                    {tool.categories && tool.categories.length > 2 && (
                                        <span className="px-2 py-1 rounded-md bg-muted text-muted-foreground text-xs font-medium">
                                            +{tool.categories.length - 2}
                                        </span>
                                    )}
                                </div>
                            </div>

                            <div className="px-5 py-3 border-t border-border/50 bg-muted/20 flex items-center justify-between">
                                <div className="flex items-center gap-1 text-sm font-medium">
                                    <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                                    {tool.total_rating ? tool.total_rating.toFixed(1) : "New"}
                                </div>
                                <div className="flex items-center gap-1 text-xs text-primary font-medium opacity-0 group-hover:opacity-100 transition-opacity transform translate-x-2 group-hover:translate-x-0 duration-300">
                                    View Details <ChevronDown className="w-3 h-3 -rotate-90" />
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Pagination Controls */}
                {!loading && totalPages > 1 && (
                    <div className="flex justify-center mt-16 gap-2">
                        <button
                            className="px-4 py-2 rounded-xl border border-border hover:bg-accent disabled:opacity-50 disabled:hover:bg-transparent transition-colors"
                            onClick={() => setPage(page => Math.max(1, page - 1))}
                            disabled={page === 1}
                        >
                            Previous
                        </button>
                        <div className="flex gap-1">
                            {Array.from({ length: totalPages }).map((_, idx) => {
                                const pageNum = idx + 1;
                                // Show first, last, current, and neighbors
                                if (
                                    pageNum === 1 ||
                                    pageNum === totalPages ||
                                    (pageNum >= page - 1 && pageNum <= page + 1)
                                ) {
                                    return (
                                        <button
                                            key={pageNum}
                                            className={
                                                "w-10 h-10 rounded-xl flex items-center justify-center text-sm font-medium transition-all " +
                                                (page === pageNum
                                                    ? "bg-primary text-primary-foreground shadow-lg shadow-primary/25 scale-110"
                                                    : "hover:bg-accent text-muted-foreground")
                                            }
                                            onClick={() => setPage(pageNum)}
                                        >
                                            {pageNum}
                                        </button>
                                    );
                                } else if (
                                    pageNum === page - 2 ||
                                    pageNum === page + 2
                                ) {
                                    return <span key={pageNum} className="w-10 h-10 flex items-center justify-center text-muted-foreground">...</span>;
                                }
                                return null;
                            })}
                        </div>
                        <button
                            className="px-4 py-2 rounded-xl border border-border hover:bg-accent disabled:opacity-50 disabled:hover:bg-transparent transition-colors"
                            onClick={() => setPage(page => Math.min(totalPages, page + 1))}
                            disabled={page === totalPages}
                        >
                            Next
                        </button>
                    </div>
                )}
            </div>

            {/* Click outside dropdown closes it */}
            {(categoryDropdownOpen || sortDropdownOpen) && (
                <div
                    className="fixed inset-0 z-10"
                    onClick={() => {
                        setCategoryDropdownOpen(false);
                        setSortDropdownOpen(false);
                    }}
                />
            )}
        </div>
    );
}