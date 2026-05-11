"use client";

import React from "react";
import { cn } from "@/lib/utils";
import { AuthFormContainerProps } from "./types";

export function AuthFormContainer({
  children,
  onSubmit,
  className = "",
}: AuthFormContainerProps) {
  return (
    <form
      onSubmit={onSubmit}
      className={cn(
        // Base styles (Mobile first)
        "relative overflow-hidden bg-white dark:bg-gray-900 rounded-[18px] shadow-2xl mx-auto flex flex-col w-full max-w-[400px]",
        // Desktop styles (lg breakpoint)
        "lg:max-w-[873px] lg:h-[583px] lg:block",
        className
      )}
    >
      {children}
    </form>
  );
}
