import {
  BackgroundCircles1,
  BackgroundCircles2,
  BackgroundCircles3,
  BackgroundCircles4,
  BackgroundCircles5,
  BackgroundDot1,
  BackgroundDot4,
  BackgroundDot5,
  BackgroundDot6,
} from "@/components/icons";

type DecorationVariant = "hero" | "movies" | "promo" | "promo-mobile";

interface BackgroundDecorationsProps {
  variant: DecorationVariant;
}

export function BackgroundDecorations({ variant }: BackgroundDecorationsProps) {
  if (variant === "hero") {
    return (
      <>
        <div className="absolute top-8 left-8 hidden lg:block z-0 opacity-50">
          <BackgroundCircles1 />
        </div>
        <div className="absolute top-1/4 right-16 hidden lg:block z-0 opacity-50">
          <BackgroundCircles2 />
        </div>
      </>
    );
  }

  if (variant === "movies") {
    return (
      <>
        {/* Desktop Background Decorations */}
        <div className="absolute bottom-8 left-8 hidden lg:block z-0">
          <BackgroundCircles3 />
        </div>
        <div className="absolute top-8 right-8 hidden lg:block z-0">
          <BackgroundCircles4 />
        </div>
        <div className="absolute top-1/4 right-1/4 hidden lg:block z-0">
          <BackgroundDot4 />
        </div>
        <div className="absolute bottom-1/3 left-1/4 hidden lg:block z-0">
          <BackgroundDot5 />
        </div>

        {/* Mobile Background Decorations */}
        <div className="absolute top-12 right-4 lg:hidden z-0">
          <BackgroundCircles5 />
        </div>
      </>
    );
  }

  if (variant === "promo") {
    return (
      <>
        {/* Desktop Background Decorations */}
        <div className="absolute top-1/2 right-8 -translate-y-1/2 hidden lg:block z-0">
          <BackgroundCircles5 />
        </div>
        <div className="absolute top-1/4 left-1/4 hidden lg:block z-0">
          <BackgroundDot1 />
        </div>
        <div className="absolute bottom-1/4 right-1/3 hidden lg:block z-0">
          <BackgroundDot6 />
        </div>

        {/* Mobile Background Decorations */}
        <div className="absolute bottom-8 left-4 lg:hidden z-0">
          <BackgroundCircles1 />
        </div>
      </>
    );
  }

  return null;
}
