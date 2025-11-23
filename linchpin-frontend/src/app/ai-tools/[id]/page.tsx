'use client';

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { aiService, AITool, AIToolReview, getProxiedLogoUrl } from "@/services/ai";
import { useAuth } from "@/context/AuthContext";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Star, TrendingUp, Trash2, ExternalLink, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import LoadingAIToolDetailSkeleton from "@/components/skeleton/LoadingAIDetails";

// --- Circular Rating SVG ---
function RatingCircle({ value }: { value: number }) {
    const percentage = (value / 5) * 100;
    const radius = 44;
    const stroke = 8;
    const normalizedRadius = radius - stroke / 2;
    const circumference = normalizedRadius * 2 * Math.PI;
    const offset = circumference - (percentage / 100) * circumference;
    return (
        <svg width={radius * 2} height={radius * 2}>
            <circle
                stroke="#e5e7eb"
                fill="transparent"
                strokeWidth={stroke}
                r={normalizedRadius}
                cx={radius}
                cy={radius}
            />
            <circle
                stroke="var(--secondary)"
                fill="transparent"
                strokeWidth={stroke}
                strokeLinecap="round"
                r={normalizedRadius}
                cx={radius}
                cy={radius}
                strokeDasharray={circumference + " " + circumference}
                strokeDashoffset={offset}
                style={{ transition: "stroke-dashoffset 0.5s" }}
            />
            <text
                x="50%"
                y="54%"
                textAnchor="middle"
                fontSize="2rem"
                fill="var(--secondary)"
                fontWeight="bold"
                dy=".3em"
            >
                {value.toFixed(1)}
            </text>
        </svg>
    );
}

export default function AIToolDetailPage() {
    const params = useParams();
    const router = useRouter();
    const id = params?.id as string;

    const { user } = useAuth();

    const [tool, setTool] = useState<AITool | null>(null);
    const [reviews, setReviews] = useState<AIToolReview[]>([]);
    const [loading, setLoading] = useState(true);
    const [reviewLoading, setReviewLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [reviewError, setReviewError] = useState<string | null>(null);

    // Review form state
    const [rating, setRating] = useState<number>(5);
    const [comment, setComment] = useState<string>("");
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        setLoading(true);
        Promise.all([
            aiService.getAIToolById(id),
            aiService.getReviews(id),
        ]).then(([toolRes, reviewsRes]) => {
            setTool(toolRes.data ?? null);
            setReviews(reviewsRes.data ?? []);
            setError(toolRes.error || reviewsRes.error || null);
            setLoading(false);
        });
    }, [id]);

    // Submit review
    async function handleReviewSubmit(e: React.FormEvent) {
        e.preventDefault();
        if (!user) return;
        setSubmitting(true);
        setReviewError(null);
        const res = await aiService.addReview(id, rating, comment);
        if (res.data) {
            setReviews([res.data, ...reviews]);
            setComment("");
            setRating(5);
        } else {
            setReviewError(res.error || "Failed to submit review.");
        }
        setSubmitting(false);
    }

    // Delete review
    async function handleDeleteReview(reviewId: string) {
        setReviewLoading(true);
        const res = await aiService.deleteReview(id, reviewId);
        if (res.message) {
            setReviews(reviews.filter(r => r._id !== reviewId));
        }
        setReviewLoading(false);
    }

    // Logo component with fallback
    function ToolLogo({ tool }: { tool: AITool }) {
        const [imgFailed, setImgFailed] = useState(false);
        const proxiedLogoUrl = getProxiedLogoUrl(tool.logo_url);

        if (proxiedLogoUrl && !imgFailed) {
            return (
                <Image
                    src={proxiedLogoUrl}
                    alt={tool.name}
                    width={128}
                    height={128}
                    className="w-32 h-32 object-contain rounded-xl"
                    onError={() => setImgFailed(true)}
                    priority
                    unoptimized
                />
            );
        }
        return (
            <div className="w-32 h-32 rounded-xl bg-muted flex items-center justify-center text-5xl font-bold text-muted-foreground">
                {tool.name[0]}
            </div>
        );
    }

    // Breakdown of star ratings [5, 4, 3, 2, 1]
    const ratingCounts = [5, 4, 3, 2, 1].map(
        (stars) => reviews.filter((r) => r.rating === stars).length
    );
    const totalRatings = reviews.length;

    if (loading) {
        // Skeleton at the outermost level
        return <LoadingAIToolDetailSkeleton />;
    }

    return (
        <div className="w-full min-h-screen bg-background pb-20">
            {/* Hero Section with Blur/Gradient */}
            <div className="relative w-full bg-muted/30 border-b border-white/10 overflow-hidden pt-10">
                <div className="absolute inset-0 bg-grid-pattern opacity-[0.03] dark:opacity-[0.07] pointer-events-none" />
                <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl animate-float pointer-events-none" />
                <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-secondary/10 rounded-full blur-3xl animate-float-delayed pointer-events-none" />

                <div className="max-w-7xl mx-auto px-4 md:px-8 py-16 relative z-10">
                    <div className="mb-8">
                        <Button
                            variant="ghost"
                            onClick={() => router.push('/ai-tools')}
                            className="pl-0 hover:pl-2 transition-all text-muted-foreground hover:text-primary"
                        >
                            <ArrowLeft className="mr-2 h-4 w-4" /> Back to Directory
                        </Button>
                    </div>

                    {error && <div className="text-destructive py-4 text-center bg-destructive/10 rounded-xl mb-6">{error}</div>}

                    {tool && (
                        <div className="flex flex-col md:flex-row gap-8 items-start">
                            {/* Logo Column */}
                            <div className="flex-shrink-0">
                                <div className="p-2 bg-white rounded-2xl shadow-xl">
                                    <ToolLogo tool={tool} />
                                </div>
                            </div>

                            {/* Info Column */}
                            <div className="flex-1 min-w-0">
                                <div className="flex flex-wrap items-center gap-3 mb-4">
                                    {tool.categories?.map((c) => (
                                        <Badge variant="secondary" key={c} className="bg-neutral-100 text-neutral-900 dark:bg-neutral-800 dark:text-white hover:bg-neutral-200 dark:hover:bg-neutral-700 border border-neutral-200 dark:border-neutral-700">
                                            {c}
                                        </Badge>
                                    ))}
                                    {tool.release_year && (
                                        <Badge variant="outline" className="border-primary/20 text-primary">
                                            {tool.release_year}
                                        </Badge>
                                    )}
                                    {tool.trending && (
                                        <Badge className="bg-orange-500/10 text-orange-500 hover:bg-orange-500/20 border-orange-500/20">
                                            <TrendingUp className="w-3 h-3 mr-1" /> Trending
                                        </Badge>
                                    )}
                                </div>

                                <h1 className="text-4xl md:text-5xl font-bold mb-4 tracking-tight text-foreground">
                                    {tool.name}
                                </h1>

                                <p className="text-xl text-muted-foreground leading-relaxed max-w-3xl mb-8">
                                    {tool.description}
                                </p>

                                <div className="flex flex-wrap gap-4 items-center">
                                    {tool.website && (
                                        <a
                                            href={tool.website}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="group relative inline-flex items-center gap-2 px-8 py-3 rounded-full bg-primary text-primary-foreground font-semibold text-lg shadow-lg shadow-primary/25 hover:shadow-primary/40 hover:-translate-y-0.5 transition-all duration-300 overflow-hidden"
                                        >
                                            <span className="relative z-10 flex items-center gap-2">
                                                Visit Website <ExternalLink className="w-5 h-5" />
                                            </span>
                                            <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700" />
                                        </a>
                                    )}

                                    <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-background border border-border shadow-sm">
                                        <Star className="w-5 h-5 text-yellow-500 fill-yellow-500" />
                                        <span className="font-bold text-lg">{tool.total_rating ? tool.total_rating.toFixed(1) : "—"}</span>
                                        <span className="text-muted-foreground text-sm">({totalRatings} reviews)</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            <div className="max-w-8xl mx-auto px-4 md:px-8 py-12 grid grid-cols-1 lg:grid-cols-3 gap-10">
                {/* Left Column: Details & Pricing */}
                <div className="lg:col-span-2 space-y-8">
                    {tool && (
                        <>
                            {/* Founders & Details Card */}
                            <Card className="overflow-hidden border-border/50 shadow-sm">
                                <CardContent className="p-8">
                                    <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
                                        <div className="w-1 h-6 bg-primary rounded-full" />
                                        Tool Details
                                    </h3>
                                    <div className="grid sm:grid-cols-2 gap-6">
                                        {!!tool.founders?.length && (
                                            <div>
                                                <div className="text-sm text-muted-foreground mb-1">Founders</div>
                                                <div className="font-medium">{tool.founders.join(", ")}</div>
                                            </div>
                                        )}
                                        {tool.skill_level && (
                                            <div>
                                                <div className="text-sm text-muted-foreground mb-1">Skill Level</div>
                                                <div className="font-medium">{tool.skill_level}</div>
                                            </div>
                                        )}
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Pricing Card */}
                            {tool.pricing && (
                                <Card className="overflow-hidden border-border/50 shadow-sm">
                                    <CardContent className="p-8">
                                        <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
                                            <div className="w-1 h-6 bg-secondary rounded-full" />
                                            Pricing
                                        </h3>
                                        <div className="bg-muted/30 rounded-xl p-6 border border-border/50">
                                            <div className="flex items-center justify-between mb-4">
                                                <span className="font-semibold text-lg">Plan Type</span>
                                                <Badge variant="secondary" className="text-base px-4 py-1">
                                                    {tool.pricing.plan}
                                                </Badge>
                                            </div>
                                            {tool.pricing.details && (
                                                <div className="space-y-3">
                                                    {tool.pricing.details.map((d, i) => (
                                                        <div key={i} className="flex items-start gap-3 p-3 rounded-lg bg-background border border-border/50">
                                                            <div className="mt-1 w-2 h-2 rounded-full bg-primary flex-shrink-0" />
                                                            <div>
                                                                <span className="font-semibold block text-sm text-primary mb-0.5">{d.type}</span>
                                                                <span className="text-muted-foreground text-sm">{d.features}</span>
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            )}
                                        </div>
                                    </CardContent>
                                </Card>
                            )}
                        </>
                    )}

                    {/* Reviews List */}
                    <div className="mt-12">
                        <h3 className="text-2xl font-bold mb-8">Community Reviews</h3>
                        {reviewLoading && <div className="text-sm text-muted-foreground mb-4">Updating...</div>}
                        {reviews.length === 0 ? (
                            <div className="text-center py-12 bg-muted/30 rounded-2xl border border-dashed border-border">
                                <div className="text-muted-foreground mb-2">No reviews yet</div>
                                <p className="text-sm text-muted-foreground">Be the first to share your experience!</p>
                            </div>
                        ) : (
                            <div className="space-y-4">
                                {reviews.map((review) => (
                                    <div key={review._id} className="p-6 bg-card border border-border/50 rounded-2xl shadow-sm hover:shadow-md transition-shadow">
                                        <div className="flex items-start justify-between mb-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center font-bold text-primary">
                                                    {review.username[0]}
                                                </div>
                                                <div>
                                                    <div className="font-semibold">{review.username}</div>
                                                    <div className="text-xs text-muted-foreground">{review.designation}</div>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-1 bg-yellow-500/10 px-2 py-1 rounded-lg text-yellow-600 font-medium text-sm">
                                                {review.rating} <Star className="w-3 h-3 fill-yellow-500" />
                                            </div>
                                        </div>
                                        <p className="text-muted-foreground leading-relaxed">
                                            {review.comment}
                                        </p>
                                        {user?._id === review.userId && (
                                            <div className="mt-4 flex justify-end">
                                                <button
                                                    className="text-destructive hover:bg-destructive/10 p-2 rounded-lg transition-colors"
                                                    onClick={() => handleDeleteReview(review._id!)}
                                                    title="Delete Review"
                                                    disabled={reviewLoading}
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                {/* Right Column: Review Form & Stats */}
                <div className="lg:col-span-1">
                    <div className="sticky top-24 space-y-8">
                        {/* Rating Stats Card */}
                        <Card className="border-border/50 shadow-lg shadow-primary/5">
                            <CardContent className="p-6">
                                <h3 className="font-bold mb-6 text-lg">Rating Breakdown</h3>
                                <div className="flex items-center justify-center mb-8">
                                    <div className="relative">
                                        <RatingCircle value={tool?.total_rating ?? 0} />
                                        <div className="absolute inset-0 flex flex-col items-center justify-center">
                                            <span className="text-3xl font-bold">{tool?.total_rating?.toFixed(1) ?? "—"}</span>
                                            <span className="text-xs text-muted-foreground">out of 5</span>
                                        </div>
                                    </div>
                                </div>
                                <div className="space-y-3">
                                    {[5, 4, 3, 2, 1].map((stars, i) => (
                                        <div key={stars} className="flex items-center gap-3 text-sm">
                                            <span className="w-3 font-medium">{stars}</span>
                                            <Star className="w-3 h-3 text-yellow-500 fill-yellow-500" />
                                            <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
                                                <div
                                                    className="h-full bg-yellow-500 rounded-full transition-all duration-500"
                                                    style={{ width: `${(ratingCounts[i] / (totalRatings || 1)) * 100}%` }}
                                                />
                                            </div>
                                            <span className="w-8 text-right text-muted-foreground">{ratingCounts[i]}</span>
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>

                        {/* Review Form Card */}
                        <Card className="border-border/50 shadow-lg shadow-primary/5">
                            <CardContent className="p-6">
                                <h3 className="font-bold mb-4 text-lg">Write a Review</h3>
                                <form onSubmit={handleReviewSubmit} className="space-y-4">
                                    {!user && (
                                        <div className="p-3 bg-muted/50 rounded-lg text-sm text-center text-muted-foreground mb-4">
                                            Please log in to write a review.
                                        </div>
                                    )}
                                    <div>
                                        <label className="block text-sm font-medium mb-2">Rating</label>
                                        <div className="flex gap-2">
                                            {[1, 2, 3, 4, 5].map((star) => (
                                                <button
                                                    key={star}
                                                    type="button"
                                                    disabled={!user}
                                                    onClick={() => setRating(star)}
                                                    className={`p-1 transition-transform hover:scale-110 ${rating >= star ? "text-yellow-500" : "text-muted"}`}
                                                >
                                                    <Star className={`w-6 h-6 ${rating >= star ? "fill-yellow-500" : ""}`} />
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium mb-2">Review</label>
                                        <textarea
                                            placeholder="Share your experience..."
                                            value={comment}
                                            onChange={e => setComment(e.target.value)}
                                            required
                                            maxLength={300}
                                            disabled={!user}
                                            className="w-full min-h-[100px] p-3 rounded-xl border border-input bg-background focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all resize-none text-sm"
                                        />
                                    </div>
                                    <Button
                                        type="submit"
                                        className="w-full rounded-xl font-semibold shadow-lg shadow-primary/20"
                                        disabled={!user || submitting}
                                    >
                                        {submitting ? "Submitting..." : "Submit Review"}
                                    </Button>
                                    {reviewError && <div className="text-destructive text-sm text-center">{reviewError}</div>}
                                </form>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
            <style jsx global>{`
                .animate-spin-slow {
                    animation: spin 3s linear infinite;
                }
                @keyframes spin {
                    0% { transform: rotate(0deg);}
                    100% { transform: rotate(360deg);}
                }
            `}</style>
        </div>
    );
}