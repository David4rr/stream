"use client";

import React, { useState } from "react";
import { EyeIcon, EyeOffIcon } from "@/components/icons";
import { AuthInputField } from "./AuthInputField";
import { PasswordInputFieldProps } from "./types";

export function PasswordInputField({
  name,
  placeholder,
  value,
  onChange,
  icon,
  required = false,
  className = "",
  autoComplete,
}: PasswordInputFieldProps) {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <AuthInputField
      type={showPassword ? "text" : "password"}
      name={name}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      icon={icon}
      required={required}
      className={className}
      autoComplete={autoComplete}
      rightElement={
        <button
          type="button"
          onClick={() => setShowPassword(!showPassword)}
          className="text-gray-400 hover:text-gray-900 dark:hover:text-gray-300 transition-colors"
          aria-label={
            showPassword ? "Sembunyikan password" : "Tampilkan password"
          }
        >
          {showPassword ? <EyeOffIcon /> : <EyeIcon />}
        </button>
      }
    />
  );
}
