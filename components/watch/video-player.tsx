"use client";

import { useState, useRef, useEffect } from "react";
import { Play, Pause, RotateCcw, RotateCw, X, VolumeX } from "lucide-react";
import { VideoControls } from "./video-controls";
import { FeedbackForm } from "@/components/beranda/FeedbackForm";
import { cn } from "@/lib/utils";
import type { StreamQuality } from "@/types/detail";
import { convertHeicUrl } from "@/lib/image-utils";

interface VideoPlayerProps {
  streamUrl: string;
  coverImage: string;
  qualities?: StreamQuality[];
  currentQuality: number;
  title: string;
  currentChapterIndex: number;
  totalChapters: number;
  onQualityChange: (quality: StreamQuality) => void;
  onVideoEnd?: () => void;
  onFeedbackPopupChange?: (showing: boolean) => void;
}

// Check if URL is an embed URL that needs iframe
function isEmbedUrl(url: string): boolean {
  // Direct video extensions - these should use <video> tag
  const videoExtensions = ['.mp4', '.m3u8', '.webm', '.ogg', '.mov'];
  const isDirectVideo = videoExtensions.some(ext => url.toLowerCase().includes(ext));

  if (isDirectVideo) return false;

  // Embed URLs that require iframe
  return url.includes('/embed/') ||
         url.includes('api.wibufile.com') ||
         url.includes('blogger.com/video.g') ||
         url.includes('video.g') ||
         url.includes('youtube.com/embed') ||
         url.includes('drive.google.com');
}

export function VideoPlayer({
  streamUrl,
  coverImage,
  qualities,
  currentQuality,
  onQualityChange,
  onVideoEnd,
  onFeedbackPopupChange,
  title,
  currentChapterIndex,
  totalChapters,
}: VideoPlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [showControls, setShowControls] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [showFeedbackPopup, setShowFeedbackPopup] = useState(false);
  const [isMutedByAutoplayPolicy, setIsMutedByAutoplayPolicy] = useState(false);
  const controlsTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Check if this is an embed URL - must be before useEffect that uses it
  const isEmbed = isEmbedUrl(streamUrl);

  // Auto-hide controls after 3 seconds
  const resetControlsTimeout = () => {
    if (controlsTimeoutRef.current) {
      clearTimeout(controlsTimeoutRef.current);
    }
    setShowControls(true);
    controlsTimeoutRef.current = setTimeout(() => {
      if (isPlaying) {
        setShowControls(false);
      }
    }, 3000);
  };

  useEffect(() => {
    return () => {
      if (controlsTimeoutRef.current) {
        clearTimeout(controlsTimeoutRef.current);
      }
    };
  }, []);

  useEffect(() => {
    if (showFeedbackPopup && videoRef.current && !isEmbed) {
      videoRef.current.pause();
    }
    onFeedbackPopupChange?.(showFeedbackPopup);
  }, [showFeedbackPopup, isEmbed]);

  // Handle autoplay — track whether user explicitly paused
  const isActuallyPlayingRef = useRef(true);

  useEffect(() => {
    const video = videoRef.current;
    if (!video || isEmbed) return;
    if (!streamUrl || streamUrl === '' || streamUrl === 'undefined' || streamUrl === 'null') {
      setHasError(true);
      setIsLoading(false);
      return;
    }

    setHasError(false);
    setIsLoading(true);

    const shouldAutoPlay = isActuallyPlayingRef.current;

    const attemptPlay = async () => {
      try {
        video.muted = false;
        await video.play();
        setIsPlaying(true);
        setIsMutedByAutoplayPolicy(false);
        isActuallyPlayingRef.current = true;
      } catch {
        isActuallyPlayingRef.current = false;
        if (!video.muted) {
          video.muted = true;
          setIsMutedByAutoplayPolicy(true);
          try {
            await video.play();
            setIsPlaying(true);
            isActuallyPlayingRef.current = true;
          } catch {
            // Give up — user must tap play manually
          }
        }
      }
    };

    if (!shouldAutoPlay) {
      setIsLoading(false);
      return;
    }

    if (video.readyState >= 3) {
      attemptPlay();
    } else {
      const onCanPlay = () => {
        video.removeEventListener("canplay", onCanPlay);
        attemptPlay();
      };
      video.addEventListener("canplay", onCanPlay);
      return () => video.removeEventListener("canplay", onCanPlay);
    }
  }, [streamUrl, isEmbed]);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handleEnded = () => {
      setIsPlaying(false);
      setShowControls(true);

      const hasCompletedFeedback = sessionStorage.getItem('feedbackCompleted');
      if (!hasCompletedFeedback) {
        setShowFeedbackPopup(true);
      } else {
        onVideoEnd?.();
      }
    };

    const handleWaiting = () => setIsLoading(true);
    const handlePlaying = () => setIsLoading(false);
    const handleCanPlay = () => setIsLoading(false);
    const handleError = () => {
      setHasError(true);
      setIsLoading(false);
    };

    video.addEventListener("ended", handleEnded);
    video.addEventListener("waiting", handleWaiting);
    video.addEventListener("playing", handlePlaying);
    video.addEventListener("canplay", handleCanPlay);
    video.addEventListener("error", handleError);

    return () => {
      video.removeEventListener("ended", handleEnded);
      video.removeEventListener("waiting", handleWaiting);
      video.removeEventListener("playing", handlePlaying);
      video.removeEventListener("canplay", handleCanPlay);
      video.removeEventListener("error", handleError);
    };
  }, [onVideoEnd]);

  const togglePlayPause = () => {
    const video = videoRef.current;
    if (!video) return;

    if (isPlaying) {
      video.pause();
      isActuallyPlayingRef.current = false;
      setIsPlaying(false);
      setShowControls(true);
    } else {
      isActuallyPlayingRef.current = true;
      sessionStorage.setItem('videoUserGesture', 'true');
      if (video.muted) {
        video.muted = false;
        setIsMutedByAutoplayPolicy(false);
      }
      video.play().catch(() => {});
      setIsPlaying(true);
      resetControlsTimeout();
    }
  };

  const handleContainerClick = (e: React.MouseEvent) => {
    // Prevent click when clicking on controls
    if ((e.target as HTMLElement).closest("[data-controls]")) return;

    if (isMutedByAutoplayPolicy) {
      const video = videoRef.current;
      if (video) {
        video.muted = false;
        setIsMutedByAutoplayPolicy(false);
        sessionStorage.setItem('videoUserGesture', 'true');
      }
    }

    resetControlsTimeout();
  };

  const handleContainerDoubleClick = () => {
    togglePlayPause();
  };

  const handleFeedbackClose = (submitted: boolean) => {
    setShowFeedbackPopup(false);
    // Hanya lanjut jika user sudah submit feedback (mandatory)
    if (submitted) {
      // Mark feedback as completed for this session
      sessionStorage.setItem('feedbackCompleted', 'true');

      // Small delay to ensure popup is fully closed before navigation
      setTimeout(() => {
        onVideoEnd?.();
      }, 100);
    }
  };

  const skipForward = () => {
    const video = videoRef.current;
    if (!video) return;
    video.currentTime = Math.min(
      video.currentTime + 10,
      video.duration || Infinity,
    );
  };

  const skipBackward = () => {
    const video = videoRef.current;
    if (!video) return;
    video.currentTime = Math.max(video.currentTime - 10, 0);
  };

  return (
    <div
      ref={containerRef}
      // className="relative flex w-full h-full bg-black rounded-2xl transition-all duration-500 ease-out hover:border-2 hover:scale-[1.04] hover:shadow-[0_0_100px_rgba(0,0,0,1)] cursor-pointer group/poster"
      className={cn(
        "relative flex w-full h-full bg-black rounded-2xl transition-all duration-500 ease-out hover:border-2",
        isEmbed ? "" : "cursor-pointer group/poster"
      )}
      onClick={isEmbed ? undefined : handleContainerClick}
      onDoubleClick={isEmbed ? undefined : handleContainerDoubleClick}
      onMouseMove={isEmbed ? undefined : resetControlsTimeout}
      onTouchStart={isEmbed ? undefined : resetControlsTimeout}
    >
      {/* Video Element or Iframe */}
      {isEmbed ? (
        <iframe
          src={streamUrl}
          className="w-full h-full rounded-2xl"
          allowFullScreen
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          style={{ border: "none" }}
        />
      ) : (
        <video
          ref={videoRef}
          src={streamUrl}
          poster={convertHeicUrl(coverImage)}
          className="w-full h-full object-contain rounded-2xl"
          playsInline
          preload="metadata"
        />
      )}

      {/* Loading Spinner - only for direct video */}
      {!isEmbed && isLoading && !hasError && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-12 h-12 border-4 border-white/30 border-t-white rounded-full animate-spin" />
        </div>
      )}

      {/* Error Message - only for direct video */}
      {!isEmbed && hasError && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/90 gap-3">
          <div className="w-16 h-16 rounded-full bg-red-500/20 flex items-center justify-center">
            <X className="w-8 h-8 text-red-500" />
          </div>
          <p className="text-white/90 text-center px-4 font-medium">Video tidak dapat diputar</p>
          <p className="text-white/50 text-sm text-center px-4 max-w-md">
            {!streamUrl || streamUrl === '' ? 'Stream tidak tersedia untuk episode ini.' : 'Coba kualitas lain atau episode lain.'}
          </p>
        </div>
      )}

      {/* Custom Overlay Text - poster style for all video types */}
      <div className="absolute flex flex-col-reverse inset-0 lg:bg-black/30 rounded-2xl lg:flex-col lg:items-center items-start lg:justify-end justify-start lg:pb-24 pb-24 lg:px-4 pl-4 text-center transition-opacity duration-500"
           style={{ opacity: !isEmbed && isPlaying ? '0' : '1' }}>
        <div className="font-serif italic text-white/80 text-sm lg:text-white/90 lg:text-[20px] mb-1 tracking-tight drop-shadow-lg transition-transform duration-500">
          Episode {currentChapterIndex + 1} / {totalChapters}
        </div>
        <h1 className="font-bold lg:text-center text-start text-white/95 lg:text-2xl text-lg lg:uppercase tracking-[0.2em] drop-shadow-2xl transition-transform duration-500">
          {title}
        </h1>
      </div>

      {/* Center Play/Pause Button with Skip Controls - only for direct video */}
      {!isEmbed && (
        <div
          className={cn(
            "absolute inset-0 flex items-center justify-center lg:gap-24 gap-9 transition-opacity duration-300",
            showControls && !isLoading
              ? "opacity-100"
              : "opacity-0 pointer-events-none",
          )}
        >
          {/* Skip Backward 10s */}
          <button
            onClick={skipBackward}
            title="Mundur 10 detik"
            className="p-3 rounded-full bg-black/20 backdrop-blur-sm border border-white/5 opacity-0 group-hover/poster:opacity-100 transform translate-y-4 group-hover/poster:translate-y-0 transition-all duration-500 delay-75 hover:bg-white/10 hover:scale-110 active:scale-95 flex flex-col items-center"
          >
            <RotateCcw className="w-6 h-6 text-white/70" strokeWidth={1.5} />
            <span className="text-[10px] text-white/50 font-bold mt-1">10s</span>
          </button>

          {/* Play/Pause Button */}
          <button
            onClick={togglePlayPause}
            className="group relative transform transition-all duration-300 hover:scale-110 active:scale-95"
          >
            <div className="absolute inset-0 bg-white/10 blur-xl rounded-full scale-150 group-hover:bg-white/20 transition-colors"></div>
            <div className="relative flex items-center justify-center">
              {isPlaying ? (
                <Pause
                  className="w-16 h-16 text-white/90 fill-white/80 drop-shadow-[0_0_15px_rgba(0,0,0,0.5)] transition-all duration-300 group-hover:scale-110 group-hover:text-white group-hover:fill-white"
                  strokeWidth={1}
                />
              ) : (
                <Play
                  className="w-16 h-16 text-white/90 fill-white/80 drop-shadow-[0_0_15px_rgba(0,0,0,0.5)] transition-all duration-300 group-hover:scale-110 group-hover:text-white group-hover:fill-white ml-1"
                  strokeWidth={1}
                />
              )}
            </div>
          </button>

          {/* Skip Forward 10s */}
          <button
            onClick={skipForward}
            title="Maju 10 detik"
            className="p-3 rounded-full bg-black/20 backdrop-blur-sm border border-white/5 opacity-0 group-hover/poster:opacity-100 transform translate-y-4 group-hover/poster:translate-y-0 transition-all duration-500 delay-150 hover:bg-white/10 hover:scale-110 active:scale-95 flex flex-col items-center"
          >
            <RotateCw className="w-6 h-6 text-white/70" strokeWidth={1.5} />
            <span className="text-[10px] text-white/50 font-bold mt-1">10s</span>
          </button>
        </div>
      )}

      {/* Bottom Controls - only for direct video */}
      {!isEmbed && (
        <div data-controls>
          <VideoControls
            videoRef={videoRef}
            containerRef={containerRef}
            isPlaying={isPlaying}
            onPlayPause={togglePlayPause}
            showControls={showControls}
            qualities={qualities}
            currentQuality={currentQuality}
            onQualityChange={onQualityChange}
          />
        </div>
      )}

      {/* Tap to Unmute Indicator */}
      {!isEmbed && isMutedByAutoplayPolicy && isPlaying && (
        <button
          onClick={() => {
            const video = videoRef.current;
            if (!video) return;
            video.muted = false;
            setIsMutedByAutoplayPolicy(false);
            sessionStorage.setItem('videoUserGesture', 'true');
          }}
          className="absolute top-4 right-4 z-40 flex items-center gap-2 px-3 py-2 rounded-full bg-black/60 backdrop-blur-sm border border-white/10 text-white/80 text-xs hover:bg-black/80 hover:text-white transition-colors"
        >
          <VolumeX className="w-4 h-4" />
          Tap untuk unmute
        </button>
      )}

      {/* Feedback Popup - Mandatory feedback, cannot be closed before submitting */}
      {showFeedbackPopup && (
        <div
          className="absolute inset-0 bg-black/80 backdrop-blur-md z-50 flex items-center justify-center p-4 animate-in fade-in duration-300"
          onClick={(e) => {
            // Only prevent if clicking directly on the overlay (not on form elements)
            if (e.target === e.currentTarget) {
              e.preventDefault();
              e.stopPropagation();
            }
          }}
        >
          <div className="w-full max-w-2xl">
            <FeedbackForm isPopup={true} onClose={handleFeedbackClose} />
          </div>
        </div>
      )}
    </div>
  );
}
