/**
 * AppHeader Component
 * Full Tailwind CSS — no inline styles/SVGs.
 */

"use client";

import { useState, useEffect, memo } from "react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { Search, X } from "lucide-react";
import { getProviderDisplayName, getProviderPageSlug } from "@/components/beranda/utils/constants";
import { ThemeToggleButton } from "./ThemeToggleButton";
import { UserDropdown } from "./UserDropdown";

export type Kategori = "drama" | "anime" | "movies" | "manga";

export interface Provider {
  name: string;
  kategori: Kategori;
  slug: string;
}

export interface AppHeaderProps {
  logo?: React.ReactNode;
  rightContent?: React.ReactNode;
  providers: Provider[];
  activeNav: number;
  onNavClick: (index: number) => void;
  isBeranda?: boolean;
  isProfileActive?: boolean;
  isSearchPage?: boolean;
  onSearch?: (query: string) => void;
  searchQuery?: string;
  isSearchLoading?: boolean;
  kategori?: string;
  providerSlug?: string;
}

const HOME_SLUG_PREFIXES = ["drama", "anime", "movies", "manga"];

const defaultLogo = (
  <div className="flex items-center">
    <span className="text-xl lg:text-2xl font-bold text-gray-900 dark:text-white">
      CID
    </span>
    <span className="text-xl lg:text-2xl font-bold text-[#3477d7]">Watch</span>
  </div>
);

export const AppHeader = memo(function AppHeader({
  logo,
  providers = [],
  activeNav,
  onNavClick,
  isBeranda = false,
  isProfileActive = false,
  isSearchPage = false,
  onSearch,
  searchQuery: initialSearchQuery = "",
  isSearchLoading = false,
  kategori = "drama",
  providerSlug = "d1",
}: AppHeaderProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [query, setQuery] = useState("");
  const [searchInput, setSearchInput] = useState(initialSearchQuery);
  const [mounted, setMounted] = useState(false);

  // Derive active index from URL slug
  const currentSlug = pathname?.split("/").filter(Boolean)[0] || "";
  const urlActiveNav = providers.findIndex(
    (p, i) => getProviderPageSlug(p, providers, i) === currentSlug
  );
  const resolvedActiveNav = urlActiveNav >= 0 ? urlActiveNav : activeNav;

  useEffect(() => {
    setMounted(true);
  }, []);
  useEffect(() => {
    setSearchInput(initialSearchQuery);
  }, [initialSearchQuery]);

  const handleBerandaSearch = () => {
    const provider = providers[resolvedActiveNav];
    if (query.trim() && provider) {
      router.push(
        `/${provider.kategori}/${provider.slug}/search?q=${encodeURIComponent(query.trim())}`,
      );
    }
  };

  const handleSearchPageSubmit = (e?: React.FormEvent) => {
    e?.preventDefault();
    if (onSearch) {
      onSearch(searchInput.trim());
    } else if (searchInput.trim()) {
      router.push(
        `/${kategori}/${providerSlug}/search?q=${encodeURIComponent(searchInput.trim())}`,
      );
    }
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-4 lg:px-16 py-4 shadow-sm bg-white/80 dark:bg-[#0e0e0e]/20 backdrop-blur-md border-b border-gray-200 dark:border-white/10">
      {/* Logo */}
      <Link href="/beranda" className="flex items-center gap-2">
        {logo || defaultLogo}
      </Link>

      {/* Provider tabs — always visible on home pages, desktop */}
      {!isSearchPage && (
        <nav className="hidden lg:flex items-center gap-8 mx-auto overflow-x-auto scrollbar-hide max-w-2xl">
          <div className="flex items-center gap-8">
            {providers.map((p, index) => {
              const name = getProviderDisplayName(p, providers, index);
              const slug = getProviderPageSlug(p, providers, index);
              return (
                <button
                  key={p.name}
                  onClick={() => router.push(`/${slug}`)}
                  className="relative text-base font-medium text-gray-900 dark:text-white hover:text-gray-700 dark:hover:text-white/80 transition-colors pb-2"
                >
                  {name}
                  {!isProfileActive && index === resolvedActiveNav && (
                    <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-[#3477d7]" />
                  )}
                </button>
              );
            })}
          </div>
        </nav>
      )}

      {/* Search form — search page only */}
      {isSearchPage && (
        <form
          onSubmit={handleSearchPageSubmit}
          className="flex-1 max-w-xl mx-4 lg:mx-8"
        >
          <div className="flex items-center px-3 py-1 rounded-full bg-gray-100 dark:bg-white/20 border border-gray-300 dark:border-white/30 transition-colors focus-within:border-[#3477d7]">
            <Search className="w-4 h-4 text-gray-500 dark:text-white/70 mr-2 shrink-0" />
            <input
              type="search"
              placeholder="Cari drama, anime, atau film..."
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSearchPageSubmit()}
              disabled={isSearchLoading}
              className="bg-transparent flex-1 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-white/70 text-sm outline-none"
            />
            {searchInput && (
              <button
                type="button"
                onClick={() => {
                  setSearchInput("");
                  onSearch?.("");
                }}
                className="p-1 hover:bg-gray-200 dark:hover:bg-white/20 rounded-full transition-colors"
              >
                <X className="w-3 h-3 text-gray-500 dark:text-white/70" />
              </button>
            )}
            <button
              type="submit"
              disabled={isSearchLoading || !searchInput.trim()}
              className="ml-2 px-3 py-1 bg-[#3477d7] text-white text-xs font-medium rounded-full hover:bg-[#2a5fb8] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Cari
            </button>
          </div>
        </form>
      )}

      {/* Right side */}
      <div className="flex items-center gap-2 lg:gap-3">
        {/* Inline search — home pages, desktop only */}
        {!isSearchPage && (
          <div className="hidden md:flex items-center px-3 lg:px-4 py-2 rounded-full bg-gray-100 dark:bg-white/20 border border-gray-300 dark:border-white transition-colors focus-within:border-[#3477d7]">
            <input
              type="search"
              placeholder="Cari drama disini"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleBerandaSearch()}
              className="bg-transparent text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-white/70 text-xs lg:text-sm outline-none w-24 lg:w-40"
            />
            <button
              onClick={handleBerandaSearch}
              className="shrink-0 outline-none ml-1 lg:ml-2"
            >
              <Search className="w-3 h-3 lg:w-4 lg:h-4 text-gray-500 dark:text-white" />
            </button>
          </div>
        )}

        <ThemeToggleButton />
        <UserDropdown mounted={mounted} />
      </div>
    </header>
  );
});

AppHeader.displayName = "AppHeader";
