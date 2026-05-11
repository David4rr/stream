import React from "react";
import {
  BackgroundCircles3,
  BackgroundCircles4,
  BackgroundCircles5,
  BackgroundDot1,
  BackgroundDot2,
  BackgroundDot3,
  BackgroundDot4,
  BackgroundDot5,
  BackgroundDot6,
} from "@/components/icons";

interface AuthBackgroundProps {
  className?: string;
}

export default function AuthBackground({ className = "" }: AuthBackgroundProps) {
  return (
    <div className={className}>
      {/* Background decorations - circles */}
      <div className="absolute right-4 top-4 flex -gap-1">
        <BackgroundCircles3 />
        <BackgroundCircles4 />
        <BackgroundCircles5 />
      </div>

      {/* Background dots */}
      <div className="absolute left-[50px] top-[95px]">
        <BackgroundDot1 />
      </div>
      <div className="absolute left-[320px] top-[88px]">
        <BackgroundDot2 />
      </div>
      <div className="absolute left-[340px] top-[105px]">
        <BackgroundDot3 />
      </div>
      <div className="absolute left-[350px] top-[190px]">
        <BackgroundDot4 />
      </div>
      <div className="absolute left-[45px] top-[220px]">
        <BackgroundDot5 />
      </div>
      <div className="absolute left-[355px] top-[250px]">
        <BackgroundDot3 />
      </div>
      <div className="absolute left-[45px] top-[280px]">
        <BackgroundDot6 />
      </div>
      <div className="absolute left-[355px] top-[420px]">
        <BackgroundDot2 />
      </div>
      <div className="absolute left-[50px] top-[430px]">
        <BackgroundDot3 />
      </div>

      {/* Gradient decorations */}
      <div className="absolute rounded-[120px] pointer-events-none blur-3xl w-[354px] h-[358px] left-[557.5px] top-[-0.5px] opacity-70 bg-[linear-gradient(135.96deg,rgba(139,120,255,0.2)_0%,rgba(84,81,214,0.2)_101.74%)]" />
      <div className="absolute rounded-[120px] pointer-events-none blur-3xl w-[354px] h-[358px] left-[299.5px] top-[412.5px] opacity-70 bg-[linear-gradient(135.96deg,rgba(139,120,255,0.12)_0%,rgba(84,81,214,0.12)_101.74%)]" />
    </div>
  );
}
