import { Loader2, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";

interface LoadMoreGenresButtonProps {
  onLoadMore: () => void;
  isLoading: boolean;
  remainingCount: number;
  hidden?: boolean;
}

export function LoadMoreGenresButton({
  onLoadMore,
  isLoading,
  remainingCount,
  hidden = false,
}: LoadMoreGenresButtonProps) {
  if (hidden || remainingCount <= 0) return null;

  return (
    <section className="min-h-[50vh] lg:min-h-screen relative flex flex-col items-center justify-center bg-white dark:bg-[#0e0e0e]">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 rounded-full bg-gradient-to-br from-blue-500/5 to-purple-500/5 blur-3xl" />
      </div>

      <div className="relative z-10 flex flex-col items-center gap-6">
        <div className="text-center">
          <p className="text-sm text-gray-500 dark:text-white/60 mb-2">
            {remainingCount} genre lagi tersedia
          </p>
          <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
            Lihat Lebih Banyak
          </h3>
        </div>

        <Button
          onClick={onLoadMore}
          disabled={isLoading}
          size="lg"
          className="rounded-full px-8 py-6 text-base gap-2 bg-[#3477d7] hover:bg-[#2a5fb8] disabled:opacity-50"
        >
          {isLoading ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              <span>Memuat...</span>
            </>
          ) : (
            <>
              <span>Load More Genres</span>
              <ChevronDown className="w-5 h-5" />
            </>
          )}
        </Button>
      </div>
    </section>
  );
}
