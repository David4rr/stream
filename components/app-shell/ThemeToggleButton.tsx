"use client";

import { useTheme } from "next-themes";
import { Sun, Moon } from "lucide-react";

interface CustomCSS extends CSSStyleDeclaration {
  webkitClipPath?: string;
}

export function ThemeToggleButton() {
  const { theme, setTheme } = useTheme();

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    const currentTheme = theme || "light";
    const isDark = currentTheme === "dark";
    const newTheme = isDark ? "light" : "dark";
    const circleColor = isDark ? "#ffffff" : "#171717";

    const { left, top, width, height } =
      e.currentTarget.getBoundingClientRect();
    const x = left + width / 2;
    const y = top + height / 2;

    const overlay = document.createElement("div");
    overlay.style.cssText = `
      position:fixed;top:0;left:0;width:100vw;height:100vh;
      pointer-events:none!important;z-index:9999999!important;
      background:${circleColor}!important;
      clip-path:circle(0% at ${x}px ${y}px);
      transition:clip-path 0.8s cubic-bezier(0.4,0,0.2,1);
      -webkit-clip-path:circle(0% at ${x}px ${y}px);
    `;
    document.documentElement.appendChild(overlay);
    void overlay.offsetWidth;
    requestAnimationFrame(() => {
      overlay.style.clipPath = `circle(150% at ${x}px ${y}px)`;
      (overlay.style as CustomCSS).webkitClipPath =
        `circle(150% at ${x}px ${y}px)`;
    });
    setTimeout(() => setTheme(newTheme), 200);
    setTimeout(() => overlay.remove(), 850);
  };

  return (
    <button
      onClick={handleClick}
      className="w-8 h-8 lg:w-9 lg:h-9 rounded-full bg-gray-100 dark:bg-white/10 border border-gray-300 dark:border-white/50 flex items-center justify-center text-gray-700 dark:text-white"
    >
      <span className="hidden dark:inline">
        <Sun className="w-3 h-3 lg:w-4 lg:h-4" />
      </span>
      <span className="dark:hidden">
        <Moon className="w-3 h-3 lg:w-4 lg:h-4" />
      </span>
    </button>
  );
}
