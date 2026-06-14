"use client";

import { useState, useCallback } from "react";
import { useRouter, usePathname } from "next/navigation";
import { Menu, X, Search, Sun, Moon, User, Heart } from "lucide-react";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";
import type { Provider, Kategori } from "../types";

interface CustomCSSStyleDeclaration extends CSSStyleDeclaration {
  webkitClipPath?: string;
}
import { getProviderDisplayName, getProviderPageSlug } from "../utils/constants";

interface HeaderProps {
  providers: Provider[];
  activeNav: number;
  setActiveNav: (index: number) => void;
  isProfileActive?: boolean;
  isFavoritesActive?: boolean;
  showSearch?: boolean;
  searchQuery?: string;
  onSearchChange?: (query: string) => void;
  onSearchSubmit?: (query: string) => void;
}

export function MobileHeader({
  providers,
  activeNav,
  setActiveNav,
  isProfileActive = false,
  isFavoritesActive = false,
  showSearch = false,
  searchQuery = "",
  onSearchChange,
  onSearchSubmit
}: HeaderProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { theme, setTheme } = useTheme();
  const router = useRouter();

  const providerNames = providers.map((p, i) => getProviderDisplayName(p, providers, i));
  const pathname = usePathname();
  const currentSlug = pathname?.split("/").filter(Boolean)[0] || "";
  // Derive which tab is active from URL
  const urlActiveNav = providers.findIndex(
    (p, i) => getProviderPageSlug(p, providers, i) === currentSlug
  );
  const resolvedActiveNav = urlActiveNav >= 0 ? urlActiveNav : activeNav;

  const handleThemeToggle = useCallback((e?: React.MouseEvent) => {
    const currentTheme = theme || "light";
    const newTheme = currentTheme === "dark" ? "light" : "dark";
    const isDark = currentTheme === "dark";
    const circleColor = isDark ? "#ffffff" : "#171717";

    let x = window.innerWidth - 40;
    let y = 40;

    if (e && e.currentTarget) {
      const rect = e.currentTarget.getBoundingClientRect();
      x = rect.left + rect.width / 2;
      y = rect.top + rect.height / 2;
    }

    const overlay = document.createElement("div");
    overlay.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      width: 100vw;
      height: 100vh;
      pointer-events: none !important;
      z-index: 9999999 !important;
      background: ${circleColor} !important;
      clip-path: circle(0% at ${x}px ${y}px);
      transition: clip-path 0.8s cubic-bezier(0.4, 0, 0.2, 1);
      -webkit-clip-path: circle(0% at ${x}px ${y}px);
    `;

    document.documentElement.appendChild(overlay);

    void overlay.offsetWidth;

    requestAnimationFrame(() => {
      overlay.style.clipPath = `circle(150% at ${x}px ${y}px)`;
      (overlay.style as CustomCSSStyleDeclaration).webkitClipPath = `circle(150% at ${x}px ${y}px)`;
    });

    setTimeout(() => {
      setTheme(newTheme);
    }, 200);

    setTimeout(() => {
      overlay.remove();
    }, 850);
  }, [theme, setTheme]);

  const handleProviderSelect = useCallback(
    (index: number) => {
      const slug = getProviderPageSlug(
        providers[index],
        providers,
        index
      );
      setSidebarOpen(false);
      router.push(`/${slug}`);
    },
    [providers, router]
  );

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-4 py-3 bg-white/80 dark:bg-[#0e0e0e]/20 backdrop-blur-md">
        <Button variant="ghost" size="icon" onClick={() => setSidebarOpen(true)} className="text-gray-900 dark:text-white hover:bg-transparent">
          <Menu className="w-5 h-5" strokeWidth={2.5} />
        </Button>

        {/* Center - Search Bar or Spacer */}
        {showSearch ? (
          <form
            onSubmit={(e) => {
              e.preventDefault();
              onSearchSubmit?.(searchQuery);
            }}
            className="flex-1 mx-3"
          >
            <div className="flex items-center px-3 py-2 rounded-full bg-gray-100 dark:bg-white/20 border border-gray-300 dark:border-white/30">
              <Search className="w-4 h-4 text-gray-500 dark:text-white/70 mr-2 flex-shrink-0" />
              <input
                type="search"
                placeholder="Cari..."
                value={searchQuery}
                onChange={(e) => onSearchChange?.(e.target.value)}
                className="flex-1 bg-transparent text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-white/70 text-sm outline-none min-w-0"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => {
                    onSearchChange?.("");
                    onSearchSubmit?.("");
                  }}
                  className="p-1 hover:bg-gray-200 dark:hover:bg-white/20 rounded-full transition-colors"
                >
                  <X className="w-3 h-3 text-gray-500" />
                </button>
              )}
            </div>
          </form>
        ) : (
          <div className="flex-1" />
        )}

        {/* Right - Logo */}
        <div className="flex items-center">
          <span className="text-sm font-bold text-gray-900 dark:text-white">CID</span>
          <span className="text-sm font-bold text-[#3477d7]">Watch</span>
        </div>
      </header>

      {sidebarOpen && (
        <>
          <div
            className="fixed inset-0 bg-black/50 z-40"
            onClick={() => setSidebarOpen(false)}
          />
          <div className="fixed left-0 top-0 bottom-0 w-64 bg-white dark:bg-black z-50 transform transition-transform duration-300 border-r border-gray-300 dark:border-white/10 flex flex-col">
            <div className="flex items-center justify-between px-4 py-4 border-b border-gray-300 dark:border-white/10">
              <div className="flex items-center">
                <span className="text-lg font-bold text-gray-900 dark:text-white">CID</span>
                <span className="text-lg font-bold text-[#3477d7]">Watch</span>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setSidebarOpen(false)}
                className="text-gray-900 dark:text-white hover:bg-transparent"
              >
                <X className="w-5 h-5" />
              </Button>
            </div>

            <nav className="p-4 flex-1 relative overflow-y-auto">
              <ul className="space-y-2">
                {providerNames.map((provider, index) => (
                  <li key={provider}>
                    <Button
                      variant="ghost"
                      onClick={() => handleProviderSelect(index)}
                      className={`w-full justify-start px-4 py-6 rounded-lg transition-colors font-normal text-base ${!isProfileActive && !isFavoritesActive && index === resolvedActiveNav
                        ? "bg-[#3477d7] text-white hover:bg-[#3477d7] hover:text-white"
                        : "text-gray-900 dark:text-white hover:bg-gray-100 dark:hover:bg-white/10"
                        }`}
                    >
                      {provider}
                    </Button>
                  </li>
                ))}
              </ul>

              <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-300 dark:border-white/10 space-y-2">
                <Button
                  variant="ghost"
                  onClick={() => {
                    setSidebarOpen(false);
                    router.push("/profile");
                  }}
                  className={`w-full justify-start gap-3 px-4 py-6 rounded-lg ${isProfileActive
                    ? "bg-[#3477d7] text-white hover:bg-[#3477d7] hover:text-white"
                    : "text-gray-900 dark:text-white hover:bg-gray-100 dark:hover:bg-white/10"
                    }`}
                >
                  <User className="w-5 h-5" />
                  <span className="font-normal text-base">Akun</span>
                </Button>
                <Button
                  variant="ghost"
                  onClick={() => {
                    setSidebarOpen(false);
                    router.push("/favorites");
                  }}
                  className={`w-full justify-start gap-3 px-4 py-6 rounded-lg ${isFavoritesActive
                    ? "bg-[#3477d7] text-white hover:bg-[#3477d7] hover:text-white"
                    : "text-gray-900 dark:text-white hover:bg-gray-100 dark:hover:bg-white/10"
                    }`}
                >
                  <Heart className="w-5 h-5" />
                  <span className="font-normal text-base">Favorit</span>
                </Button>
                <Button
                  variant="ghost"
                  onClick={(e) => handleThemeToggle(e)}
                  className="w-full justify-start gap-3 px-4 py-6 text-gray-900 dark:text-white hover:bg-gray-100 dark:hover:bg-white/10 rounded-lg"
                >
                  <span className="hidden dark:inline">
                    <Sun className="w-5 h-5" />
                  </span>
                  <span className="dark:hidden">
                    <Moon className="w-5 h-5" />
                  </span>
                  <span className="font-normal text-base">{theme === "dark" ? "Light Mode" : "Dark Mode"}</span>
                </Button>
              </div>
            </nav>
          </div>
        </>
      )}
    </>
  );
}

interface CategoryTabsProps {
  providers: Provider[];
  activeTab: number;
  setActiveTab: (index: number) => void;
}

export function CategoryTabs({ providers, activeTab, setActiveTab }: CategoryTabsProps) {
  const providerNames = providers.map((p, i) => getProviderDisplayName(p, providers, i));

  const handleTabClick = useCallback(
    (index: number) => {
      setActiveTab(index);
    },
    [setActiveTab]
  );

  return (
    <div className="px-4 pb-2">
      <div className="flex items-center gap-8 overflow-x-auto scrollbar-hide">
        {providerNames.map((provider, index) => (
          <Button
            key={provider}
            variant="ghost"
            onClick={() => handleTabClick(index)}
            className={`relative shrink-0 p-0 h-auto pb-3 hover:bg-transparent rounded-none ${index === activeTab
              ? "font-bold text-gray-900 dark:text-white"
              : "font-medium text-gray-600 dark:text-white/70"
              }`}
          >
            <span className="text-[15px]">
              {provider}
            </span>
            {index === activeTab && (
              <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-[#3477d7]" />
            )}
          </Button>
        ))}
      </div>
    </div>
  );
}

export function SearchBar({ kategori, providerSlug }: { kategori: Kategori; providerSlug: string }) {
  const [query, setQuery] = useState("");
  const router = useRouter();

  const handleSearch = () => {
    if (query.trim()) {
      router.push(`/${kategori}/${providerSlug}/search?q=${encodeURIComponent(query.trim())}`);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  return (
    <div className="px-4 mb-6">
      <div className="relative h-9 rounded-3xl border border-gray-400 dark:border-[#787878] bg-transparent flex items-center px-4 transition-colors focus-within:border-[#3477d7]">
        <input
          type="search"
          placeholder="Cari drama disini"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={handleKeyDown}
          className="flex-1 bg-transparent text-[15px] font-medium text-gray-900 dark:text-white outline-none placeholder-gray-500 dark:placeholder-white/50"
        />
        <button onClick={handleSearch} className="flex-shrink-0 outline-none ml-2">
          <Search className="w-5 h-5 text-gray-500 dark:text-[#787878]" />
        </button>
      </div>
    </div>
  );
}
