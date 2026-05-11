"use client";

import React from "react";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { AuthInputFieldProps } from "./types";

export function AuthInputField({
  type,
  name,
  placeholder,
  value,
  onChange,
  icon,
  required = false,
  className = "",
  rightElement,
  autoComplete,
}: AuthInputFieldProps) {
  return (
    <div className={cn("relative", className)}>
      <div className="absolute left-0 top-0 h-full flex items-center justify-center pl-3 text-gray-400">
        {icon}
      </div>
      <Input
        type={type}
        name={name}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        required={required}
        autoComplete={autoComplete}
        className={cn("pl-10 h-[38px] w-full leading-none", rightElement && "pr-10")}
      />
      {rightElement && (
        <div className="absolute right-0 top-0 h-full flex items-center justify-center pr-3">
          {rightElement}
        </div>
      )}
    </div>
  );
}
