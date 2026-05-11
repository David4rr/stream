import React from "react";

interface AuthFooterProps {
  className?: string;
}

export default function AuthFooter({ className = "" }: AuthFooterProps) {
  return (
    <footer className={`relative z-10 mt-6 md:mt-8 px-4 ${className}`}>
      <p className="text-sm md:text-xl text-center text-white dark:text-gray-300">
        © 2026 CIDWatch. All Rights Reserved
      </p>
    </footer>
  );
}
