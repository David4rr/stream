"use client";

import React from "react";
import { AuthHeaderProps } from "./types";

export function AuthHeader({
  title,
  subtitle,
  className = "",
}: AuthHeaderProps) {
  return (
    <div className={className}>
      <h2 className="text-xl md:text-2xl font-semibold text-black dark:text-white mb-2">
        {title}
      </h2>
      <p className="text-xs md:text-sm text-[#8c8c8c] dark:text-gray-400">
        {subtitle}
      </p>
    </div>
  );
}
