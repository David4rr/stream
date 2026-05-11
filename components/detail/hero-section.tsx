"use client";

import { HeroBanner } from "@/components/ui/hero-banner";

interface HeroSectionProps {
    coverImage: string;
    title: string;
    type?: number;
}

export function HeroSection({ coverImage, title, type }: HeroSectionProps) {
    return (
        <HeroBanner
            src={coverImage}
            alt={title}
            type={type}
        />
    );
}
