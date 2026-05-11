"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAppSelector } from "@/store/hooks";
import { selectIsAuthenticated, selectIsHydrated } from "@/store/auth-slice";
import { AuthLayoutWrapper } from "@/components/ui/auth-layout-wrapper";
import { OnboardingHeader } from "@/components/onboarding/OnboardingHeader";
import { OnboardingHero } from "@/components/onboarding/OnboardingHero";
import { OnboardingCTA } from "@/components/onboarding/OnboardingCTA";

export default function OnboardingPage() {
  const router = useRouter();
  const isAuthenticated = useAppSelector(selectIsAuthenticated);
  const isHydrated = useAppSelector(selectIsHydrated);

  useEffect(() => {
    // Only redirect after hydration is complete and user is authenticated
    if (isHydrated && isAuthenticated) {
      router.replace("/beranda");
    }
  }, [isAuthenticated, isHydrated, router]);

  // Show loading spinner while checking auth or during initial hydration
  if (!isHydrated) {
    return (
      <AuthLayoutWrapper variant="onboarding" showThemeToggle={false}>
        <div className="flex items-center justify-center min-h-screen">
          <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
        </div>
      </AuthLayoutWrapper>
    );
  }

  // If hydrated and authenticated, don't render content (redirect in progress)
  if (isAuthenticated) {
    return null;
  }

  return (
    <AuthLayoutWrapper variant="onboarding" showThemeToggle={false}>
      <OnboardingHeader />

      <main className="flex flex-col items-center justify-center text-center w-full max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8 md:space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-700 ease-out z-10 relative">
        <section className="w-full">
          <OnboardingHero />
        </section>

        <section className="w-full">
          <OnboardingCTA />
        </section>
      </main>

      <footer className="absolute bottom-6 md:bottom-8 left-0 right-0 w-full text-center z-20">
        <p className="text-xs md:text-sm text-gray-500 dark:text-gray-400 font-medium opacity-80 transition-colors">
          © 2026 CIDWatch. All Rights Reserved
        </p>
      </footer>
    </AuthLayoutWrapper>
  );
}
