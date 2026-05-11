/**
 * useIsMobile Hook
 *
 * Detects if the current viewport is mobile-sized.
 * Uses lg breakpoint (1024px) as the threshold.
 */

import { useState, useEffect } from "react";

export function useIsMobile(): boolean {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1024); // lg breakpoint
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  return isMobile;
}
