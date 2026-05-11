"use client";

import { Button } from "@/components/ui/button";

export function MobileFooter() {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer className="px-4 py-8 text-center border-t border-gray-300 dark:border-white/10">
      <div className="flex justify-center mb-2">
        <div className="w-6 h-6 bg-[#3477d7] rounded flex items-center justify-center">
          <span className="text-white text-xs">▶</span>
        </div>
      </div>
      <p className="text-[11px] font-medium text-gray-600 dark:text-[#60605e] mb-1">
        Etshhh.... Stop! Cus coba balik lagi dari paling atas.
      </p>
      <Button
        variant="link"
        onClick={scrollToTop}
        className="text-[11px] font-medium text-gray-900 dark:text-white h-auto p-0 hover:no-underline"
      >
        Kembali ke atas
      </Button>

      <p className="text-xs text-gray-500 dark:text-[#60605e] mt-6">
        All Copyright ©2024 CIDWatch
      </p>
    </footer>
  );
}
