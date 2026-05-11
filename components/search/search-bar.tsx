"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface SearchBarProps {
    onSearch: (query: string) => void;
    initialQuery?: string;
    disabled?: boolean;
}

export function SearchBar({ onSearch, initialQuery = "", disabled }: SearchBarProps) {
    const [query, setQuery] = useState(initialQuery);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (query.trim()) {
            onSearch(query.trim());
        }
    };

    const handleClear = () => {
        setQuery("");
        onSearch("");
    };

    return (
        <form onSubmit={handleSubmit} className="flex gap-2 w-full max-w-2xl mx-auto">
            <div className="relative flex-1">
                <Input
                    type="text"
                    placeholder="Cari drama, anime, atau film..."
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    disabled={disabled}
                    className="pr-10"
                />
                {query && (
                    <button
                        type="button"
                        onClick={handleClear}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
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
                                d="M6 18 18 6M6 6l12 12"
                            />
                        </svg>
                    </button>
                )}
            </div>
            <Button type="submit" disabled={disabled || !query.trim()} className="bg-[#3477D7] px-4">
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="w-4 h-4 mr-2"
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z"
                    />
                </svg>
                Cari
            </Button>
        </form>
    );
}
