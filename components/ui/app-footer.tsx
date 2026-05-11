"use client";

import Link from "next/link";
import { Globe } from "lucide-react";

interface FooterLinkGroup {
    title: string;
    links: { label: string; href: string }[];
}

const footerLinks: FooterLinkGroup[] = [
    {
        title: "Company",
        links: [
            { label: "About", href: "#" },
            { label: "Careers", href: "#" },
            { label: "Our Culture", href: "#" },
            { label: "Press Room", href: "#" },
            { label: "Advertise with Us", href: "#" },
        ],
    },
    {
        title: "Plex Pass",
        links: [
            { label: "Go Premium", href: "#" },
            { label: "Plexamp", href: "#" },
            { label: "Plex Labs", href: "#" },
            { label: "Get Perks", href: "#" },
        ],
    },
    {
        title: "Downloads",
        links: [
            { label: "Plex Media Server", href: "#" },
            { label: "Apps & Devices", href: "#" },
            { label: "Plexamp", href: "#" },
            { label: "Where to Watch", href: "#" },
        ],
    },
    {
        title: "Support",
        links: [
            { label: "Finding Help", href: "#" },
            { label: "Support Library", href: "#" },
            { label: "Community Forums", href: "#" },
            { label: "Billing Questions", href: "#" },
            { label: "Status", href: "#" },
        ],
    },
    {
        title: "Watch Free",
        links: [
            { label: "TV Channel Finder", href: "#" },
            { label: "What to Watch", href: "#" },
            { label: "What to Watch on Hulu", href: "#" },
            { label: "A24 Collection", href: "#" },
        ],
    },
];

interface AppFooterProps {
    className?: string;
}

export function AppFooter({ className }: AppFooterProps) {
    return (
        <footer
            className={`mt-12 border-t border-border/30 bg-card/50 ${className ?? ""}`}
        >
            <div className="mx-auto max-w-7xl px-4 py-12 md:px-6 lg:px-8">
                {/* Top Section - Logo and Links */}
                <div className="mb-10 grid gap-8 md:grid-cols-2 lg:grid-cols-6">
                    {/* Logo and Social */}
                    <div className="lg:col-span-1">
                        <Link href="/" className="mb-4 inline-block">
                            <span className="text-xl font-bold">
                                <span className="text-black dark:text-white">CID</span>
                                <span className="text-[#3477D7]">Watch</span>
                            </span>
                        </Link>
                        <p className="text-xs text-muted-foreground">FOLLOW US</p>
                    </div>

                    {/* Link Groups */}
                    {footerLinks.map((group) => (
                        <div key={group.title}>
                            <h3 className="mb-3 text-sm font-semibold text-foreground">
                                {group.title}
                            </h3>
                            <ul className="space-y-2">
                                {group.links.map((link) => (
                                    <li key={link.label}>
                                        <Link
                                            href={link.href}
                                            className="text-xs text-muted-foreground transition-colors hover:text-foreground"
                                        >
                                            {link.label}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>

                {/* Bottom Section */}
                <div className="flex flex-col items-center justify-between gap-4 border-t border-border/30 pt-6 text-xs text-muted-foreground md:flex-row">
                    <p>All Copyright ©2024 CIDWatch</p>

                    <div className="flex items-center gap-6">
                        {/* Language Selector */}
                        <button className="flex items-center gap-1 transition-colors hover:text-foreground">
                            <Globe className="h-3 w-3" />
                            Language: English (US)
                        </button>

                        {/* Privacy Links */}
                        <Link href="#" className="transition-colors hover:text-foreground">
                            Privacy & Legal
                        </Link>
                        <Link href="#" className="transition-colors hover:text-foreground">
                            Manage Cookies
                        </Link>
                    </div>
                </div>
            </div>
        </footer>
    );
}
