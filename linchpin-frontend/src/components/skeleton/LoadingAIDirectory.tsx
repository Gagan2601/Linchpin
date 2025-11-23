import { Skeleton } from "@/components/ui/skeleton";

export default function LoadingAIDirectorySkeleton() {
    // How many cards per row? Use the same as your real grid.
    // Let's do 3 rows of 3 for desktop, 2 for tablet, and 1 for mobile.
    const skeletons = Array.from({ length: 9 });
    return (
        <div className="max-w-6xl mx-auto px-4 py-10">
            <Skeleton className="h-8 w-1/3 mb-4" /> {/* Big heading */}
            <Skeleton className="h-5 w-2/3 mb-8" /> {/* Subheading */}
            <div className="mb-4">
                <Skeleton className="h-10 w-full" /> {/* Search bar */}
            </div>
            <div className="flex flex-wrap gap-4 mb-6 items-center">
                <Skeleton className="h-10 w-32" /> {/* Category dropdown */}
                <Skeleton className="h-10 w-32" /> {/* Sort dropdown */}
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-7">
                {skeletons.map((_, i) => (
                    <div
                        key={i}
                        className="rounded-xl border bg-card shadow-sm min-h-[204px] flex flex-col"
                    >
                        <div className="flex items-center gap-4 p-4 pb-0">
                            <Skeleton className="w-14 h-14 rounded-lg" />
                            <div className="flex-1">
                                <Skeleton className="h-4 w-3/5 mb-2" />
                                <Skeleton className="h-3 w-1/4" />
                                <Skeleton className="h-3 w-1/5 mt-1" />
                            </div>
                        </div>
                        <div className="p-4 pt-2 flex-1 flex flex-col justify-end">
                            <Skeleton className="h-3 w-full mb-2" />
                            <Skeleton className="h-3 w-2/3 mb-2" />
                            <div className="flex gap-2 mt-2">
                                <Skeleton className="w-10 h-4" />
                                <Skeleton className="w-16 h-4" />
                            </div>
                        </div>
                    </div>
                ))}
            </div>
            <div className="flex justify-center mt-10 gap-2 flex-wrap">
                <Skeleton className="h-8 w-20" />
                <Skeleton className="h-8 w-8" />
                <Skeleton className="h-8 w-8" />
                <Skeleton className="h-8 w-20" />
            </div>
        </div>
    );
}