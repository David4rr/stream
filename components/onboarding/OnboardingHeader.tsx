"use client";

import React from "react";
import Link from "next/link";
import { ThemeToggle } from "@/components/theme-toggle";

export function OnboardingHeader() {
  return (
    <header className="absolute top-0 left-0 right-0 z-50 flex items-center justify-between w-full px-6 py-4 md:px-12 md:py-8 max-w-7xl mx-auto">
      {/* Logo */}
      <Link href="/" className="flex items-center gap-1 group">
        <span className="text-2xl md:text-[25px] font-bold text-gray-900 dark:text-white group-hover:opacity-90 transition-all duration-300">
          CID
        </span>
        <span className="text-2xl md:text-[25px] font-bold text-[#3477d7] group-hover:opacity-90 transition-all duration-300">
          Watch
        </span>
      </Link>

      {/* Navigation */}
      <nav className="flex items-center gap-4 md:gap-8">
        <div className="hidden md:block w-px h-6 bg-gray-300 dark:bg-gray-700 mx-2" />
        <ThemeToggle />
        
        <Link
          href="/login"
          className="text-sm md:text-base font-semibold text-gray-700 dark:text-gray-200 hover:text-[#3477d7] dark:hover:text-[#3477d7] transition-colors"
        >
          Masuk
        </Link>
        <Link
          href="/register"
          className="text-sm md:text-base font-semibold text-gray-700 dark:text-gray-200 hover:text-[#3477d7] dark:hover:text-[#3477d7] transition-colors"
        >
          Daftar
        </Link>
      </nav>
    </header>
  );
}
