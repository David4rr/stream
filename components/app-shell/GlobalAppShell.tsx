"use client";

import { useEffect, ReactNode, useCallback } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useAppSelector, useAppDispatch } from "@/store/hooks";
import { fetchProviders } from "@/store/providers-slice";
import { fetchBerandaData } from "@/store/beranda-slice";
import { AppHeader } from "./AppHeader";
import { MobileHeader } from "@/components/beranda/mobile/header";
import { getProviderPageSlug } from "@/components/beranda/utils/constants";
import type { Provider } from "./AppHeader";

interface GlobalAppShellProps {
  children: ReactNode;
}

// Provider slug pages — treated as "home" pages
const HOME_SLUG_PREFIXES = [
  "drama",
  "anime",
  "movies",
  "manga",
];

function isHomePagePath(pathname: string | null): boolean {
  if (!pathname) return false;
  // /beranda redirect page
  if (pathname.startsWith("/beranda")) return true;
  // /drama, /animes1, /animes2, /movies1, /movies2, /mangas1, /mangas2
  const firstSegment = pathname.split("/").filter(Boolean)[0] || "";
  return HOME_SLUG_PREFIXES.some((prefix) => firstSegment.startsWith(prefix));
}

export function GlobalAppShell({ children }: GlobalAppShellProps) {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const providers = useAppSelector(
    (state) => state.providers.providers ?? []
  ) as Provider[];
  const footerData = useAppSelector((state) => state.beranda?.data?.footer);

  // Compute activeNav from URL slug instead of Redux index
  const currentSlug = pathname?.split("/").filter(Boolean)[0] || "";
  const activeNav = providers.findIndex(
    (p, i) => getProviderPageSlug(p as any, providers as any, i) === currentSlug
  );

  // Extract kategori and providerSlug from pathname for search
  const pathMatch = pathname?.match(/^\/([^/]+)\/([^/]+)\/search/);
  const kategori = pathMatch?.[1] || "drama";
  const providerSlug = pathMatch?.[2] || "d1";

  // Derive searchQuery directly from searchParams
  const searchQuery = searchParams?.get("q") || "";

  // Fetch providers & footer data on mount (skip auth pages)
  useEffect(() => {
    const isAuthPage =
      pathname?.startsWith("/login") || pathname?.startsWith("/register");
    if (isAuthPage) return;

    if (!providers || providers.length === 0) {
      dispatch(fetchProviders());
    }

    if (!footerData) {
      dispatch(fetchBerandaData());
    }
  }, [providers?.length, footerData, dispatch, pathname]);

  const isAuthPage =
    pathname?.startsWith("/login") || pathname?.startsWith("/register");
  const isApiRoute =
    pathname?.startsWith("/api") || pathname?.startsWith("/auth");
  const isWatchPage = pathname?.includes("/watch") || false;
  const isOnboarding = pathname === "/" || false;
  const isSearchPage = pathname?.includes("/search") || false;
  const isHomePage = isHomePagePath(pathname);
  const isProfile = pathname?.startsWith("/profile") || false;
  const isFavorites = pathname?.startsWith("/favorites") || false;
  const isDetailPage = pathname?.includes("/detail") || false;

  // Navigate to provider slug on tab click
  const handleNavClick = useCallback(
    (index: number) => {
      const slug = getProviderPageSlug(
        providers[index] as any,
        providers as any,
        index
      );
      router.push(`/${slug}`);
    },
    [providers, router]
  );

  const handleSearch = useCallback(
    (query: string) => {
      if (query) {
        router.push(
          `/${kategori}/${providerSlug}/search?q=${encodeURIComponent(query)}`
        );
      } else {
        router.push(`/${kategori}/${providerSlug}/search`);
      }
    },
    [router, kategori, providerSlug]
  );

  if (isAuthPage || isApiRoute || isWatchPage || isOnboarding) {
    return <div className="min-h-screen bg-black">{children}</div>;
  }

  const defaultFooter = footerData ? (
    <footer className="bg-white dark:bg-[#0e0e0e] border-t border-gray-200 dark:border-white/10">
      <div className="px-8 lg:px-16 py-12">
        <div className="max-w-6xl mx-auto">
          <p className="text-xs text-gray-500 dark:text-gray-400 text-center mb-4">
            {footerData.copyright}
          </p>
          <div className="flex justify-center gap-4">
            {footerData.legalLinks.map((link: { label: string; href?: string }) => (
              <a
                key={link.label}
                href={link.href || "#"}
                className="text-xs text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
              >
                {link.label}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  ) : null;

  return (
    <div className="min-h-screen bg-white dark:bg-[#0e0e0e]">
      {/* Desktop Header */}
      <div className="hidden lg:block">
        <AppHeader
          providers={providers}
          activeNav={activeNav >= 0 ? activeNav : 0}
          onNavClick={handleNavClick}
          isBeranda={true}
          isProfileActive={isProfile || isFavorites}
          isSearchPage={isSearchPage}
          onSearch={handleSearch}
          searchQuery={searchQuery}
          isSearchLoading={false}
          kategori={kategori}
          providerSlug={providerSlug}
        />
      </div>

      {/* Mobile Header */}
      <div className="lg:hidden">
        {(isHomePage || isProfile || isSearchPage || isDetailPage || isFavorites) && (
          <MobileHeader
            providers={providers}
            activeNav={activeNav >= 0 ? activeNav : 0}
            setActiveNav={handleNavClick}
            isProfileActive={isProfile}
            isFavoritesActive={isFavorites}
            showSearch={isSearchPage}
            searchQuery={searchQuery}
            onSearchChange={(query) => {
              if (query) {
                router.push(
                  `/${kategori}/${providerSlug}/search?q=${encodeURIComponent(query)}`
                );
              } else {
                router.push(`/${kategori}/${providerSlug}/search`);
              }
            }}
            onSearchSubmit={handleSearch}
          />
        )}
      </div>

      {/* Main Content */}
      <div>{children}</div>

      {/* Global Footer — all pages except home slug pages (they have own footer) */}
      {!isHomePage && defaultFooter}
    </div>
  );
}
