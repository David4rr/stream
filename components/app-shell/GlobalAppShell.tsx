"use client";

import { useEffect, ReactNode, useCallback } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useAppSelector, useAppDispatch } from "@/store/hooks";
import { fetchProviders } from "@/store/providers-slice";
import { fetchBerandaData } from "@/store/beranda-slice";
import { AppHeader } from "./AppHeader";
import { MobileHeader } from "@/components/beranda/mobile/header";
import type { Provider } from "./AppHeader";

interface GlobalAppShellProps {
  children: ReactNode;
}

export function GlobalAppShell({ children }: GlobalAppShellProps) {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const providers = useAppSelector(
    (state) => state.providers.providers ?? [],
  ) as Provider[];
  const activeNav = useAppSelector(
    (state) => state.providers.selectedProviderIndex ?? 0,
  );
  const footerData = useAppSelector((state) => state.beranda?.data?.footer);

  // Extract kategori and providerSlug from pathname for search
  const pathMatch = pathname?.match(/^\/([^/]+)\/([^/]+)\/search/);
  const kategori = pathMatch?.[1] || "drama";
  const providerSlug = pathMatch?.[2] || "d1";

  // Derive searchQuery directly from searchParams (no setState in effect)
  const searchQuery = searchParams?.get("q") || "";

  // Fetch providers & footer data on mount (skip untuk halaman auth)
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

  // Halaman yang tidak pakai header
  const isAuthPage =
    pathname?.startsWith("/login") || pathname?.startsWith("/register");
  const isApiRoute =
    pathname?.startsWith("/api") || pathname?.startsWith("/auth");
  const isWatchPage = pathname?.includes("/watch") || false;
  const isOnboarding = pathname === "/" || false;

  // Halaman search
  const isSearchPage = pathname?.includes("/search") || false;

  // Halaman beranda (punya footer sendiri, jangan render global footer)
  const isBeranda = pathname?.startsWith("/beranda") || false;

  // Check if current route is /profile
  const isProfile = pathname?.startsWith("/profile") || false;

  // Halaman favorites
  const isFavorites = pathname?.startsWith("/favorites") || false;

  // Halaman detail
  const isDetailPage = pathname?.includes("/detail") || false;
  const handleNavClick = (index: number) => {
    dispatch({ type: "providers/setSelectedProviderIndex", payload: index });
    router.push("/beranda");
  };

  // Handle search for search page
  const handleSearch = useCallback(
    (query: string) => {
      if (query) {
        router.push(
          `/${kategori}/${providerSlug}/search?q=${encodeURIComponent(query)}`,
        );
      } else {
        router.push(`/${kategori}/${providerSlug}/search`);
      }
    },
    [router, kategori, providerSlug],
  );

  // Untuk halaman auth, watch, & onboarding: render children tanpa shell
  if (isAuthPage || isApiRoute || isWatchPage || isOnboarding) {
    return <div className="min-h-screen bg-black">{children}</div>;
  }

  // Default footer (sama untuk desktop dan mobile)
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

  // Untuk halaman dengan header
  return (
    <div className="min-h-screen bg-white dark:bg-[#0e0e0e]">
      {/* Desktop Header - Global */}
      <div className="hidden lg:block">
        <AppHeader
          providers={providers}
          activeNav={activeNav}
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

      {/* Mobile Header - Global (reusable MobileHeader component) */}
      <div className="lg:hidden">
        {(isBeranda || isProfile || isSearchPage || isDetailPage || isFavorites) && (
          <MobileHeader
            providers={providers}
            activeNav={activeNav}
            setActiveNav={handleNavClick}
            isProfileActive={isProfile}
            isFavoritesActive={isFavorites}
            showSearch={isSearchPage}
            searchQuery={searchQuery}
            onSearchChange={(query) => {
              if (query) {
                router.push(
                  `/${kategori}/${providerSlug}/search?q=${encodeURIComponent(query)}`,
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

      {/* Global Footer - semua halaman kecuali /beranda */}
      {!isBeranda && defaultFooter}
    </div>
  );
}
