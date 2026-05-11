"use client";

import { StreamingShell } from "@/components/app-shell";
import { BackgroundGlow } from "@/components/icons";
import { UnifiedBerandaMobile } from "./UnifiedBerandaMobile";
import { UnifiedBerandaDesktop } from "./UnifiedBerandaDesktop";
import type {
  Provider,
  Drama,
  Genre,
  BerandaData,
} from "./types";

interface UnifiedBerandaProps {
  providers: Provider[];
  recommendations: Drama[];
  newRelease: Drama[];
  genres: Genre[];
  genreDramas: Record<number, Drama[]>;
  isLoadingGenreDramas?: boolean;
  selectedProvider: Provider;
  selectedProviderIndex: number;
  selectedCardIndex: number;
  isContentLoading: boolean;
  berandaData: BerandaData;
  totalSections: number;
  visibleGenreCount: number;
  totalGenreCount: number;
  onLoadMoreGenres: () => void;
  isLoadingMoreGenres: boolean;
  onProviderChange: (provider: Provider, index: number) => void;
  onCardChange: (index: number) => void;
}

export function UnifiedBeranda({
  providers,
  recommendations,
  newRelease,
  genres,
  genreDramas,
  isLoadingGenreDramas,
  selectedProvider,
  selectedProviderIndex,
  selectedCardIndex,
  isContentLoading,
  berandaData,
  totalSections,
  visibleGenreCount,
  totalGenreCount,
  onLoadMoreGenres,
  isLoadingMoreGenres,
  onProviderChange,
  onCardChange,
}: UnifiedBerandaProps) {
  const sharedProps = {
    providers,
    recommendations,
    newRelease,
    genres,
    genreDramas,
    selectedProvider,
    selectedProviderIndex,
    berandaData,
    visibleGenreCount,
    totalGenreCount,
    onLoadMoreGenres,
    isLoadingMoreGenres,
    onProviderChange,
  };

  const desktopOnlyProps = {
    selectedCardIndex,
    isContentLoading,
    isLoadingGenreDramas,
    totalSections,
    onCardChange,
  };

  return (
    <div className="min-h-screen bg-background relative overflow-x-hidden">
      <BackgroundGlow />
      <div className="lg:hidden">
        <UnifiedBerandaMobile {...sharedProps} />
      </div>
      <div className="hidden lg:block">
        <StreamingShell totalSections={totalSections}>
          <UnifiedBerandaDesktop {...sharedProps} {...desktopOnlyProps} />
        </StreamingShell>
      </div>
    </div>
  );
}
