"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Menu, User } from "lucide-react";

interface AppHeaderProps {
    className?: string;
}

export function AppHeader({ className }: AppHeaderProps) {
    return (
        <header
            className={`fixed inset-x-0 top-0 z-50 flex h-14 items-center justify-between bg-background/80 px-4 backdrop-blur-md md:px-6 ${className ?? ""}`}
        >
            {/* Left - Hamburger Menu (Mobile) */}
            <Button variant="ghost" size="icon" className="md:hidden">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Open menu</span>
            </Button>

            {/* Center/Left - Logo */}
            <Link href="/beranda" className="flex items-center">
                <span className="text-lg font-bold">
                    <span className="text-black dark:text-white">CID</span>
                    <span className="text-[#3477D7]">Watch</span>
                </span>
            </Link>

            {/* Right - User Avatar */}
            <Button
                variant="ghost"
                size="icon"
                className="rounded-full border border-border/50"
            >
                <User className="h-5 w-5 " />
                <span className="sr-only">User profile</span>
            </Button>
        </header>
    );
}
