"use client";

import React from "react";

export function OnboardingHero() {
  return (
    <div className="flex flex-col items-center justify-center text-center max-w-4xl mx-auto px-4 space-y-4 md:space-y-6">
      <h1 className="text-[28px] md:text-[40px] font-bold text-gray-900 dark:text-white leading-tight md:leading-snug tracking-tight transition-colors duration-300">
        All-in-One Entertainment App,
        <br />
        <span className="block mt-2 md:mt-0">Satu Aplikasi. Semua Cerita</span>
      </h1>
      
      <p className="text-base md:text-xl font-semibold text-gray-600 dark:text-gray-300 max-w-2xl mx-auto opacity-90 transition-colors duration-300">
        Mulai dari Rp. 57.000, dapat semua akses di akun premium
      </p>
    </div>
  );
}
