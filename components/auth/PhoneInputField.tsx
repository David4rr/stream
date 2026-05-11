"use client";

import React from "react";
import { AuthInputField } from "./AuthInputField";
import { PhoneInputFieldProps } from "./types";

export function PhoneInputField({
  name,
  placeholder,
  value,
  onChange,
  icon,
  required = false,
  className = "",
}: PhoneInputFieldProps) {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const onlyNums = e.target.value.replace(/[^0-9]/g, "");
    onChange(onlyNums);
  };

  return (
    <AuthInputField
      type="text"
      name={name}
      placeholder={placeholder}
      value={value}
      onChange={handleChange}
      icon={icon}
      required={required}
      className={className}
    />
  );
}
