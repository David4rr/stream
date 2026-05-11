import { cn } from "@/lib/utils";
import type { ReactNode } from "react";
import { SectionIndicator } from "../SectionIndicator";

export interface SectionContainerProps {
  children: ReactNode;
  sectionNumber?: number;
  className?: string;
  fullWidth?: boolean;
  showSectionIndicator?: boolean;
  totalSections?: number;
}

export function SectionContainer({
  children,
  sectionNumber,
  className,
  fullWidth = true,
  showSectionIndicator = false,
  totalSections,
}: SectionContainerProps) {
  return (
    <div
      id={sectionNumber ? `section-${sectionNumber}` : undefined}
      className={cn(
        "relative overflow-hidden bg-white dark:bg-[#0e0e0e]",
        fullWidth ? "w-full" : "w-full max-w-7xl mx-auto",
        fullWidth && "h-full min-h-screen",
        className
      )}
    >
      {children}

      {showSectionIndicator && sectionNumber && (
        <SectionIndicator current={sectionNumber} total={totalSections} />
      )}
    </div>
  );
}

interface SectionContentProps {
  children: ReactNode;
  className?: string;
}

export function SectionContent({ children, className }: SectionContentProps) {
  return (
    <div
      className={cn(
        "relative z-10 h-full min-h-screen flex flex-col justify-center px-4 sm:px-8 lg:px-12 xl:px-16 py-8 lg:py-10",
        className
      )}
    >
      {children}
    </div>
  );
}
