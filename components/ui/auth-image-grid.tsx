import React from "react";

interface AuthImageGridProps {
  className?: string;
}

export default function AuthImageGrid({ className = "" }: AuthImageGridProps) {
  return (
    <div className={`pointer-events-none absolute w-[475px] h-[929px] left-0 top-0 ${className}`}>
      {/* Column 1 - right side */}
      <div className="absolute rounded-[7px] bg-[#d9d9d9] w-[145px] h-[220px] left-[766.5px] top-[-27.5px] shadow-[0px_4px_4px_0_rgba(0,0,0,0.1)]" />
      <div className="absolute rounded-[7px] bg-[#d9d9d9] w-[145px] h-[220px] left-[766.5px] top-[208.5px] shadow-[0px_4px_4px_0_rgba(0,0,0,0.1)]" />
      <div className="absolute rounded-[7px] bg-[#d9d9d9] w-[145px] h-[220px] left-[766.5px] top-[444.5px] shadow-[0px_4px_4px_0_rgba(0,0,0,0.1)]" />

      {/* Column 2 - middle */}
      <div className="absolute rounded-[7px] bg-[#d9d9d9] w-[145px] h-[220px] left-[601.5px] top-[298.5px] shadow-[0px_4px_4px_0_rgba(0,0,0,0.1)]" />
      <div className="absolute rounded-[7px] bg-[#d9d9d9] w-[145px] h-[220px] left-[601.5px] top-[62.5px] shadow-[0px_4px_4px_0_rgba(0,0,0,0.1)]" />
      <div className="absolute rounded-[7px] bg-[#d9d9d9] w-[145px] h-[220px] left-[601.5px] top-[-173.5px] shadow-[0px_4px_4px_0_rgba(0,0,0,0.1)]" />

      {/* Column 3 - left */}
      <div className="absolute rounded-[7px] bg-[#d9d9d9] w-[145px] h-[220px] left-[436.5px] top-[-30.5px] shadow-[0px_4px_4px_0_rgba(0,0,0,0.1)]" />
      <div className="absolute rounded-[7px] bg-[#d9d9d9] w-[145px] h-[220px] left-[436.5px] top-[442.5px] shadow-[0px_4px_4px_0_rgba(0,0,0,0.1)]" />
      <div className="absolute rounded-[7px] bg-[#d9d9d9] w-[145px] h-[220px] left-[436.5px] top-[206.5px] shadow-[0px_4px_4px_0_rgba(0,0,0,0.1)]" />
      <div className="absolute rounded-[7px] bg-[#d9d9d9] w-[145px] h-[220px] left-[600.5px] top-[535.5px] shadow-[0px_4px_4px_0_rgba(0,0,0,0.1)]" />
    </div>
  );
}
