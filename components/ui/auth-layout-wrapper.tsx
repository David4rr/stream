import React, { type ReactNode } from "react";
import { ThemeToggle } from "@/components/theme-toggle";
import {
  BackgroundCircles1,
  BackgroundCircles2,
} from "@/components/icons";

interface AuthLayoutWrapperProps {
  children: ReactNode;
  /**
   * Position options for gradient circles
   * @default "login"
   */
  variant?: "login" | "register" | "onboarding";
  /**
   * Whether to show the theme toggle button
   * @default true
   */
  showThemeToggle?: boolean;
}

/**
 * Wrapper untuk auth pages yang berisi:
 * - Background layers
 * - Gradient circles
 * - Theme toggle
 */
export function AuthLayoutWrapper({
  children,
  variant = "login",
  showThemeToggle = true,
}: AuthLayoutWrapperProps) {
  // Config untuk gradient circles berdasarkan variant
  const gradientConfig = {
    login: {
      left: {
        className:
          "absolute hidden md:block rounded-[177px] opacity-70 blur-3xl w-[407.36px] h-[411.96px] left-[10%] top-[20%] -translate-x-1/2 -translate-y-1/2",
        bg: "bg-[linear-gradient(135.96deg,rgba(139,120,255,0.12)_0%,rgba(84,81,214,0.12)_101.74%)]",
      },
      right: {
        className:
          "absolute hidden md:block rounded-[177px] opacity-70 blur-3xl w-[407.36px] h-[411.96px] right-[10%] top-[60%] translate-x-1/2 -translate-y-1/2",
        bg: "bg-[linear-gradient(135.96deg,rgba(0,0,0,0.2)_0%,rgba(84,81,214,0.2)_55.76%)]",
      },
      circle1: "right-[10%] top-[15%]",
      circle2: "right-[8%] top-[20%]",
    },
    register: {
      left: {
        className:
          "absolute hidden md:block rounded-[177px] opacity-70 blur-3xl w-[407.36px] h-[411.96px] -left-[100px] -top-[180px]",
        bg: "bg-[linear-gradient(135.96deg,rgba(139,120,255,0.12)_0%,rgba(84,81,214,0.12)_101.74%)]",
      },
      right: {
        className:
          "absolute hidden md:block rounded-[177px] opacity-70 blur-3xl w-[407.36px] h-[411.96px] right-0 bottom-0",
        bg: "bg-[linear-gradient(135.96deg,rgba(0,0,0,0.2)_0%,rgba(84,81,214,0.2)_55.76%)]",
      },
      circle1: "right-[10%] bottom-[10%]",
      circle2: "right-[15%] bottom-[8%]",
    },
    onboarding: {
      left: {
        className:
          "absolute hidden md:block rounded-[177px] opacity-70 blur-3xl w-[407.36px] h-[411.96px] -left-[96px] -top-[178px]",
        bg: "bg-[linear-gradient(135.96deg,rgba(139,120,255,0.12)_0%,rgba(84,81,214,0.12)_101.74%)]",
      },
      right: {
        className:
          "absolute hidden md:block rounded-[177px] opacity-70 blur-3xl w-[407.36px] h-[411.96px] right-[10%] bottom-[10%]",
        bg: "bg-[linear-gradient(135.96deg,rgba(0,0,0,0.2)_0%,rgba(84,81,214,0.2)_55.76%)]",
      },
      // Using generic positioning for circles if not specified in raw code
      circle1: "right-[5%] top-[5%]",
      circle2: "right-[8%] top-[8%]",
    },
  };

  const config = gradientConfig[variant];

  return (
    <div className="min-h-screen w-full bg-white dark:bg-gray-950 relative flex flex-col items-center justify-center overflow-hidden p-4 transition-colors duration-300">
      {/* Background layers */}
      <div className="absolute inset-0 bg-white dark:bg-gray-950 transition-colors duration-300" />
      <div className="absolute inset-0 bg-gray-50/50 dark:bg-black/40 transition-colors duration-300" />

      {/* Decorative gradient circles */}
      <div className={`${config.left.className} ${config.left.bg}`} />
      <div className={`${config.right.className} ${config.right.bg}`} />

      {/* Background circles */}
      <div className={`absolute hidden md:block ${config.circle1}`}>
        <BackgroundCircles1 />
      </div>
      <div className={`absolute hidden md:block ${config.circle2}`}>
        <BackgroundCircles2 />
      </div>

      {/* Theme Toggle - Positioned in top right */}
      {showThemeToggle && (
        <div className="absolute top-4 right-4 z-50">
          <ThemeToggle />
        </div>
      )}

      {/* Children content */}
      {children}
    </div>
  );
}
