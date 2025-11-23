import { Skeleton } from "@/components/ui/skeleton";

export default function LoadingAIToolDetailSkeleton() {
    return (
        <div className="max-w-3xl mx-auto px-4 py-12">
            <div className="rounded-xl border bg-card shadow-sm">
                <div className="p-6 pb-0">
                    <div className="flex flex-col md:flex-row gap-6 items-center md:items-start">
                        <Skeleton className="w-20 h-20 rounded-lg mb-2" />
                        <div className="flex-1 w-full">
                            <Skeleton className="h-8 w-2/3 mb-4" />
                            <div className="flex flex-wrap gap-2 mb-4">
                                <Skeleton className="h-6 w-16" />
                                <Skeleton className="h-6 w-10" />
                                <Skeleton className="h-6 w-20" />
                            </div>
                            <Skeleton className="h-4 w-1/4 mb-2" />
                            <Skeleton className="h-3 w-1/2" />
                        </div>
                    </div>
                </div>
                <div className="p-6 pt-4">
                    <Skeleton className="h-4 w-2/3 mb-4" />
                    <Skeleton className="h-3 w-full mb-2" />
                    <Skeleton className="h-3 w-3/4" />
                </div>
            </div>
            <div className="mt-10">
                <Skeleton className="h-6 w-1/3 mb-6" /> {/* Reviews heading */}
                <div className="space-y-4">
                    {Array.from({ length: 3 }).map((_, i) => (
                        <div key={i} className="p-4 border rounded flex gap-3 items-start">
                            <Skeleton className="w-8 h-8 rounded-full" />
                            <div className="flex-1">
                                <Skeleton className="h-4 w-1/4 mb-2" />
                                <Skeleton className="h-3 w-2/3 mb-1" />
                                <Skeleton className="h-3 w-1/2" />
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}