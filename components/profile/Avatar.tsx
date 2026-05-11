"use client";

import { useState, useEffect } from "react";

interface AvatarProps {
  initial: string;
  avatarUrl?: string;
}

export function ProfileAvatar({ initial, avatarUrl }: AvatarProps) {
  const [avatarError, setAvatarError] = useState(false);

  useEffect(() => {
    // Defer setState to avoid synchronous call warning
    requestAnimationFrame(() => {
      setAvatarError(false);
    });
  }, [avatarUrl]);

  return (
    <div className="relative h-[101px] w-[101px]">
      <div className="absolute inset-0 rounded-full border-2 border-[#3477D7] bg-white overflow-hidden" />
      <div className="absolute inset-[5px] rounded-full bg-[#363636] overflow-hidden">
        {avatarUrl && !avatarError ? (
          <img
            src={avatarUrl}
            alt="Avatar"
            className="absolute inset-0 w-full h-full object-cover"
            onError={() => setAvatarError(true)}
          />
        ) : (
          <span className="absolute inset-0 flex items-center justify-center text-3xl font-bold text-white">{initial}</span>
        )}
      </div>
    </div>
  );
}
