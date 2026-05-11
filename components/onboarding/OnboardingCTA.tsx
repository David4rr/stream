"use client";

import React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRightIcon } from "lucide-react";

export function OnboardingCTA() {
  return (
    <div className="flex flex-col items-center justify-center space-y-6 md:space-y-8 mt-6 md:mt-10 px-4">
      <div className="text-sm font-medium text-center text-gray-600 dark:text-gray-400 max-w-lg mx-auto leading-relaxed transition-colors duration-300">
        <p>Mau langsung Nonton ?, udah ingin nyobain keseruannya ?</p>
        <p className="mt-1">klik tombol di bawah</p>
      </div>

      <Link href="/login" className="w-full max-w-[222px] group">
        <Button
          size="lg"
          className="w-full h-12 md:h-[46px] rounded-[9px] bg-gradient-to-br from-[#1b3e71] to-[#3477d7] hover:from-[#3477d7] hover:to-[#1b3e71] shadow-xl hover:shadow-2xl transition-all duration-300 transform group-hover:scale-105"
        >
          <span className="text-lg md:text-xl font-semibold text-white tracking-wide">Gas Nonton!</span>
          <ArrowRightIcon className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
        </Button>
      </Link>
    </div>
  );
}
