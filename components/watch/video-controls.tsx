"use client";

import { useState, useEffect, useRef } from "react";
import { Play, Pause, Volume2, VolumeX, Maximize, Minimize, RotateCcw, RotateCw } from "lucide-react";
import { cn } from "@/lib/utils";
import { QualitySelector } from "./quality-selector";
import type { StreamQuality } from "@/types/detail";

interface VideoControlsProps {
    videoRef: React.RefObject<HTMLVideoElement | null>;
    containerRef?: React.RefObject<HTMLDivElement | null>;
    isPlaying: boolean;
    onPlayPause: () => void;
    showControls: boolean;
    qualities?: StreamQuality[];
    currentQuality?: number;
    onQualityChange?: (quality: StreamQuality) => void;
}

export function VideoControls({
    videoRef,
    containerRef,
    isPlaying,
    onPlayPause,
    showControls,
    qualities = [],
    currentQuality = 720,
    onQualityChange,
}: VideoControlsProps) {
    const [currentTime, setCurrentTime] = useState(0);
    const [duration, setDuration] = useState(0);
    const [isMuted, setIsMuted] = useState(false);
    const [isFullscreen, setIsFullscreen] = useState(false);
    const [isDragging, setIsDragging] = useState(false);
    const progressRef = useRef<HTMLDivElement>(null);


    useEffect(() => {
        const video = videoRef.current;
        if (!video) return;

        const handleTimeUpdate = () => {
            if (!isDragging) {
                setCurrentTime(video.currentTime);
            }
        };

        const handleLoadedMetadata = () => {
            setDuration(video.duration);
        };

        const handleDurationChange = () => {
            setDuration(video.duration);
        };

        video.addEventListener("timeupdate", handleTimeUpdate);
        video.addEventListener("loadedmetadata", handleLoadedMetadata);
        video.addEventListener("durationchange", handleDurationChange);

        return () => {
            video.removeEventListener("timeupdate", handleTimeUpdate);
            video.removeEventListener("loadedmetadata", handleLoadedMetadata);
            video.removeEventListener("durationchange", handleDurationChange);
        };
    }, [videoRef, isDragging]);

    // Listen for fullscreen changes
    useEffect(() => {
        const handleFullscreenChange = () => {
            setIsFullscreen(!!document.fullscreenElement);
        };

        document.addEventListener("fullscreenchange", handleFullscreenChange);
        return () => {
            document.removeEventListener("fullscreenchange", handleFullscreenChange);
        };
    }, []);

    const formatTime = (time: number) => {
        if (isNaN(time)) return "0:00";
        const minutes = Math.floor(time / 60);
        const seconds = Math.floor(time % 60);
        return `${minutes}:${seconds.toString().padStart(2, "0")}`;
    };

    const handleProgressClick = (e: React.MouseEvent<HTMLDivElement>) => {
        const video = videoRef.current;
        const progressBar = progressRef.current;
        if (!video || !progressBar) return;

        const rect = progressBar.getBoundingClientRect();
        const pos = (e.clientX - rect.left) / rect.width;
        video.currentTime = pos * duration;
    };

    const toggleMute = () => {
        const video = videoRef.current;
        if (!video) return;
        video.muted = !video.muted;
        setIsMuted(video.muted);
    };

    const skipForward = () => {
        const video = videoRef.current;
        if (!video) return;
        video.currentTime = Math.min(video.currentTime + 10, duration);
    };

    const skipBackward = () => {
        const video = videoRef.current;
        if (!video) return;
        video.currentTime = Math.max(video.currentTime - 10, 0);
    };

    const toggleFullscreen = async () => {
        const container = containerRef?.current;
        if (!container) return;

        try {
            if (!document.fullscreenElement) {
                await container.requestFullscreen();
            } else {
                await document.exitFullscreen();
            }
        } catch (error) {
        }
    };

    const progress = duration > 0 ? (currentTime / duration) * 100 : 0;

    return (
        <div
            className={cn(
                "absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent rounded-2xl p-4 transition-opacity duration-300",
                showControls ? "opacity-100" : "opacity-0 pointer-events-none"
            )}
        >
            {/* Progress Bar */}
            <div
                ref={progressRef}
                onClick={handleProgressClick}
                className="w-full h-1 bg-white/30 rounded-full cursor-pointer mb-4 group"
            >
                <div
                    className="h-full bg-primary rounded-full relative transition-all"
                    style={{ width: `${progress}%` }}
                >
                    <div className="absolute right-0 top-1/2 -translate-y-1/2 w-3 h-3 bg-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
            </div>

            {/* Controls Row */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    {/* Play/Pause */}
                    <button
                        onClick={onPlayPause}
                        className="text-white hover:text-primary transition-colors"
                    >
                        {isPlaying ? (
                            <Pause className="h-6 w-6 fill-current" />
                        ) : (
                            <Play className="h-6 w-6 fill-current" />
                        )}
                    </button>

                    {/* Skip Backward 10s - Desktop only */}
                    <button
                        onClick={skipBackward}
                        className="hidden lg:flex text-white hover:text-primary transition-colors items-center gap-1"
                        title="Mundur 10 detik"
                    >
                        <RotateCcw className="h-5 w-5" />
                        <span className="text-xs">10</span>
                    </button>

                    {/* Skip Forward 10s - Desktop only */}
                    <button
                        onClick={skipForward}
                        className="hidden lg:flex text-white hover:text-primary transition-colors items-center gap-1"
                        title="Maju 10 detik"
                    >
                        <RotateCw className="h-5 w-5" />
                        <span className="text-xs">10</span>
                    </button>

                    {/* Volume */}
                    <button
                        onClick={toggleMute}
                        className="text-white hover:text-primary transition-colors"
                    >
                        {isMuted ? (
                            <VolumeX className="h-5 w-5" />
                        ) : (
                            <Volume2 className="h-5 w-5" />
                        )}
                    </button>

                    {/* Time */}
                    <span className="text-white text-sm">
                        {formatTime(currentTime)} / {formatTime(duration)}
                    </span>
                </div>

                {/* Right side controls - Desktop only */}
                <div className="hidden lg:flex items-center gap-4">
                    {/* Quality Selector */}
                    {qualities.length > 0 && onQualityChange && (
                        <QualitySelector
                            qualities={qualities}
                            currentQuality={currentQuality}
                            onQualityChange={onQualityChange}
                        />
                    )}

                    {/* Fullscreen Toggle */}
                    <button
                        onClick={toggleFullscreen}
                        className="text-white hover:text-primary transition-colors"
                        title={isFullscreen ? "Keluar layar penuh" : "Layar penuh"}
                    >
                        {isFullscreen ? (
                            <Minimize className="h-5 w-5" />
                        ) : (
                            <Maximize className="h-5 w-5" />
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
}
