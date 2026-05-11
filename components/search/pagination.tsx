"use client";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface PaginationProps {
    currentPage: number;
    totalPages: number;
    onPageChange: (page: number) => void;
}

export function Pagination({ currentPage, totalPages, onPageChange }: PaginationProps) {
    if (totalPages <= 1) return null;

    const getVisiblePages = () => {
        const pages: (number | "...")[] = [];
        const maxVisible = 5;

        if (totalPages <= maxVisible) {
            return Array.from({ length: totalPages }, (_, i) => i + 1);
        }

        // Always show first page
        pages.push(1);

        const start = Math.max(2, currentPage - 1);
        const end = Math.min(totalPages - 1, currentPage + 1);

        if (start > 2) {
            pages.push("...");
        }

        for (let i = start; i <= end; i++) {
            pages.push(i);
        }

        if (end < totalPages - 1) {
            pages.push("...");
        }

        // Always show last page
        pages.push(totalPages);

        return pages;
    };

    const visiblePages = getVisiblePages();

    return (
        <div className="flex items-center justify-center gap-1 sm:gap-2 mt-6 sm:mt-8 pb-6 sm:pb-9">
            <Button
                variant="outline"
                className="flex h-8 w-8 sm:h-9 sm:w-9 p-0"
                size="sm"
                onClick={() => onPageChange(currentPage - 1)}
                disabled={currentPage === 1}
            >
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="w-3.5 h-3.5 sm:w-4 sm:h-4"
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M15.75 19.5 8.25 12l7.5-7.5"
                    />
                </svg>
            </Button>

            {visiblePages.map((page, index) =>
                page === "..." ? (
                    <span key={`ellipsis-${index}`} className="px-1 sm:px-2 text-xs sm:text-sm text-muted-foreground">
                        ...
                    </span>
                ) : (
                    <Button
                        key={page}
                        variant={currentPage === page ? "default" : "outline"}
                        size="sm"
                        onClick={() => onPageChange(page)}
                        className={cn(
                            "min-w-[28px] sm:min-w-9 h-8 sm:h-9 text-xs sm:text-sm flex bg-[#3477D7]",
                            currentPage === page && "pointer-events-none"
                        )}
                    >
                        {page}
                    </Button>
                )
            )}

            <Button
                variant="outline"
                size="sm"
                className="h-8 w-8 sm:h-9 sm:w-9 p-0"
                onClick={() => onPageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
            >
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="w-4 h-4"
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="m8.25 4.5 7.5 7.5-7.5 7.5"
                    />
                </svg>
            </Button>
        </div>
    );
}
