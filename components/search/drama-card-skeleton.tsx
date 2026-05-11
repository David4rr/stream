"use client";

export function DramaCardSkeleton() {
    return (
        <div className="relative aspect-[2/3] rounded-lg overflow-hidden bg-muted animate-pulse">
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
            <div className="absolute bottom-0 left-0 right-0 p-3">
                <div className="h-4 bg-muted-foreground/20 rounded w-3/4 mb-2" />
                <div className="h-3 bg-muted-foreground/20 rounded w-1/2" />
            </div>
        </div>
    );
}
