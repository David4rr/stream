"use client";

/**
 * StreamingShell Component
 *
 * Navigation overlay untuk Beranda (Streaming Platform)
 * Mendukung full-screen sections dengan navigation dots di kanan
 * Header sudah ditangani oleh GlobalAppShell
 *
 * Dots: windowed fisheye — max 7 visible, centered on active section.
 * Edge dots shrink to signal overflow when there are more sections beyond.
 */

import React, { useState, useEffect, useCallback, useMemo } from "react";
import { ArrowUp, ArrowDown } from "lucide-react";

const MAX_VISIBLE_DOTS = 7;

/** Returns the start/end section numbers that are visible in the dot window. */
function getVisibleRange(
  active: number,
  total: number,
): { start: number; end: number } {
  if (total <= MAX_VISIBLE_DOTS) return { start: 1, end: total };
  const half = Math.floor(MAX_VISIBLE_DOTS / 2);
  let start = active - half;
  let end = active + half;
  if (start < 1) {
    start = 1;
    end = MAX_VISIBLE_DOTS;
  }
  if (end > total) {
    end = total;
    start = total - MAX_VISIBLE_DOTS + 1;
  }
  return { start, end };
}

/**
 * Returns a size class for a dot based on its distance from the active section
 * within the visible window, producing a fisheye / telescope effect.
 * The outermost slots (distance = half of window) are smallest when they
 * represent overflow (more sections exist beyond them).
 */
function getDotSize(
  sectionNum: number,
  active: number,
  start: number,
  end: number,
  total: number,
): { size: string; opacity: string } {
  const dist = Math.abs(sectionNum - active);
  const isEdgeWithOverflow =
    (sectionNum === start && start > 1) || (sectionNum === end && end < total);

  if (dist === 0) return { size: "w-2.5 h-2.5", opacity: "opacity-100" };
  if (isEdgeWithOverflow && dist >= 3)
    return { size: "w-1 h-1", opacity: "opacity-30" };
  if (isEdgeWithOverflow || dist >= 3)
    return { size: "w-1.5 h-1.5", opacity: "opacity-40" };
  if (dist === 2) return { size: "w-2 h-2", opacity: "opacity-60" };
  return { size: "w-2.5 h-2.5", opacity: "opacity-80" };
}

interface StreamingShellProps {
  children: React.ReactNode;
  totalSections?: number;
}

export function StreamingShell({
  children,
  totalSections = 6,
}: StreamingShellProps) {
  const [activeSection, setActiveSection] = useState(1);

  const handleSectionChange = useCallback((section: number) => {
    const element = document.getElementById(`section-${section}`);
    if (element) {
      const top = element.getBoundingClientRect().top + window.scrollY;
      window.scrollTo({
        top: top,
        behavior: "smooth",
      });
    }
  }, []);

  const handlePrev = () => {
    if (activeSection > 1) {
      handleSectionChange(activeSection - 1);
    }
  };

  const handleNext = () => {
    if (activeSection < totalSections) {
      handleSectionChange(activeSection + 1);
    }
  };

  // Detect active section on scroll
  useEffect(() => {
    const handleScroll = () => {
      const scrollMiddle = window.scrollY + window.innerHeight / 2;

      for (let i = 1; i <= totalSections; i++) {
        const el = document.getElementById(`section-${i}`);
        if (el) {
          const rect = el.getBoundingClientRect();
          const absoluteTop = rect.top + window.scrollY;
          const absoluteBottom = absoluteTop + rect.height;

          // Check if scroll middle point is within this section
          if (scrollMiddle >= absoluteTop && scrollMiddle < absoluteBottom) {
            if (activeSection !== i) {
              setActiveSection(i);
            }
            break;
          }
        }
      }
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [totalSections, activeSection]);

  // Windowed dot range — recalculate only when active/total changes
  const { start, end } = useMemo(
    () => getVisibleRange(activeSection, totalSections),
    [activeSection, totalSections],
  );

  const visibleDots = useMemo(() => {
    const dots: number[] = [];
    for (let i = start; i <= end; i++) dots.push(i);
    return dots;
  }, [start, end]);

  return (
    <>
      {/* Main Content */}
      <main className="relative w-full">{children}</main>

      {/* Right Navigation Sidebar - Desktop Only */}
      <div className="hidden lg:flex fixed right-4 sm:right-5 lg:right-6 top-1/2 -translate-y-1/2 z-50 flex-col items-center gap-3">
        {/* Dots — windowed, max 7 visible */}
        <div className="flex flex-col items-center gap-2.5">
          {visibleDots.map((sectionNum) => {
            const isActive = sectionNum === activeSection;
            const { size, opacity } = getDotSize(
              sectionNum,
              activeSection,
              start,
              end,
              totalSections,
            );

            return (
              <button
                key={sectionNum}
                onClick={() => handleSectionChange(sectionNum)}
                className={[
                  "rounded-full transition-all duration-300",
                  size,
                  opacity,
                  isActive
                    ? "bg-gray-900 dark:bg-white"
                    : "bg-gray-400/50 dark:bg-white/40 hover:bg-gray-600/70 dark:hover:bg-white/60",
                ].join(" ")}
                aria-label={`Go to section ${sectionNum}`}
              />
            );
          })}
        </div>

        {/* Arrows */}
        <div className="flex flex-col gap-2 mt-2">
          <button
            onClick={handlePrev}
            disabled={activeSection === 1}
            className="w-9 h-9 rounded-full bg-gray-200/80 dark:bg-black/30 border border-gray-400 dark:border-white/30 flex items-center justify-center text-gray-700 dark:text-white hover:bg-gray-300 dark:hover:bg-black/50 transition-colors disabled:opacity-30"
          >
            <ArrowUp className="w-4 h-4" />
          </button>
          <button
            onClick={handleNext}
            disabled={activeSection === totalSections}
            className="w-9 h-9 rounded-full bg-gray-200/80 dark:bg-black/30 border border-gray-400 dark:border-white/30 flex items-center justify-center text-gray-700 dark:text-white hover:bg-gray-300 dark:hover:bg-black/50 transition-colors disabled:opacity-30"
          >
            <ArrowDown className="w-4 h-4" />
          </button>
        </div>
      </div>
    </>
  );
}
