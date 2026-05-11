"use client";

import { useState, useEffect } from "react";
import { Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { StreamQuality } from "@/types/detail";

interface QualitySelectorProps {
    qualities: StreamQuality[];
    currentQuality: number;
    onQualityChange: (quality: StreamQuality) => void;
}

export function QualitySelector({
    qualities,
    currentQuality,
    onQualityChange,
}: QualitySelectorProps) {
    const [isOpen, setIsOpen] = useState(false);

    // Sort qualities descending (1080 -> 720 -> 540)
    const sortedQualities = [...qualities].sort((a, b) => b.quality - a.quality);

    return (
        <div className="relative">
            <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsOpen(!isOpen)}
                className="text-white hover:bg-white/20 gap-1"
            >
                <Settings className="h-4 w-4" />
                <span className="text-sm">{currentQuality}p</span>
            </Button>

            {isOpen && (
                <>
                    {/* Backdrop */}
                    <div
                        className="fixed inset-0 z-40"
                        onClick={() => setIsOpen(false)}
                    />

                    {/* Dropdown */}
                    <div className="absolute right-0 bottom-full mb-2 z-50 bg-black/90 backdrop-blur-sm rounded-lg border border-white/10 overflow-hidden min-w-[100px]">
                        {sortedQualities.map((q, index) => (
                            <button
                                key={`${q.quality}-${index}`}
                                onClick={() => {
                                    onQualityChange(q);
                                    setIsOpen(false);
                                }}
                                className={`w-full px-4 py-2 text-left text-sm transition-colors hover:bg-white/10 ${currentQuality === q.quality
                                    ? "text-primary bg-white/5"
                                    : "text-white"
                                    }`}
                            >
                                {q.quality}p
                            </button>
                        ))}
                    </div>
                </>
            )}
        </div>
    );
}

/**
 * Get default quality (720p or highest available) - safe for SSR
 */
export function getDefaultQuality(qualities?: StreamQuality[]): StreamQuality {
    if (!qualities || qualities.length === 0) {
        // Return fallback quality if no qualities available
        return { quality: 720, streamUrl: "" };
    }
    const sortedQualities = [...qualities].sort((a, b) => b.quality - a.quality);
    return sortedQualities.find((q) => q.quality === 720) || sortedQualities[0] || { quality: 720, streamUrl: "" };
}

/**
 * Hook to detect optimal quality based on network connection (client-side only)
 */
export function useAutoQuality(
    qualities: StreamQuality[],
    onQualityChange: (quality: StreamQuality) => void
) {
    useEffect(() => {
        const sortedQualities = [...qualities].sort((a, b) => b.quality - a.quality);

        // Check if Network Information API is available
        if ("connection" in navigator) {
            const connection = (navigator as Navigator & { connection?: { effectiveType?: string } }).connection;
            const effectiveType = connection?.effectiveType;

            let autoQuality: StreamQuality;

            if (effectiveType === "4g") {
                // Fast connection: highest quality
                autoQuality = sortedQualities[0];
            } else if (effectiveType === "3g") {
                // Medium connection: 720p if available
                autoQuality = sortedQualities.find((q) => q.quality <= 720) || sortedQualities[sortedQualities.length - 1];
            } else {
                // Slow connection: lowest quality
                autoQuality = sortedQualities[sortedQualities.length - 1];
            }

            onQualityChange(autoQuality);
        }
    }, [qualities, onQualityChange]);
}
