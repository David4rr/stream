"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { GoogleIcon } from "@/components/icons";
import { authButtonStyles } from "./styles";
import { cn } from "@/lib/utils";
import { SocialLoginButtonsProps } from "./types";

const dividerClass = "flex-1 h-px bg-[#eeeff2] dark:bg-gray-700";
const dividerTextClass =
  "text-xs text-[#868d95] dark:text-gray-400 whitespace-nowrap";

export function SocialLoginButtons({
  onGoogleLogin,
  className = "",
}: SocialLoginButtonsProps) {
  return (
    <div className={cn("flex flex-col gap-6", className)}>
      <div className="flex items-center gap-4">
        <div className={dividerClass} />
        <span className={dividerTextClass}>Masuk dengan</span>
        <div className={dividerClass} />
      </div>

      <div className="flex justify-center">
        <Button
          type="button"
          variant="outline"
          onClick={onGoogleLogin}
          className={authButtonStyles.social}
          aria-label="Masuk dengan Google"
        >
          <GoogleIcon />
          <span className="text-xs font-medium">Google</span>
        </Button>
      </div>
    </div>
  );
}
