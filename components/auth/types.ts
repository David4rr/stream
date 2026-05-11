import React, { ReactNode } from "react";

export interface AuthFormContainerProps {
  children: ReactNode;
  onSubmit: (e: React.FormEvent) => void;
  className?: string;
}

export interface AuthHeaderProps {
  title: string;
  subtitle: string;
  className?: string;
}

export interface AuthInputFieldProps {
  type: string;
  name: string;
  placeholder: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  icon: React.ReactNode;
  required?: boolean;
  className?: string;
  rightElement?: React.ReactNode;
  autoComplete?: string;
}

export interface PasswordInputFieldProps {
  name: string;
  placeholder: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  icon: React.ReactNode;
  required?: boolean;
  className?: string;
  autoComplete?: string;
}

export interface PhoneInputFieldProps {
  name: string;
  placeholder: string;
  value: string;
  onChange: (value: string) => void;
  icon: React.ReactNode;
  required?: boolean;
  className?: string;
}

export interface LoginPageProps {
  onGoogleLogin?: () => void;
  onRegisterClick?: () => void;
  /** Called after a successful login; receives the path to redirect to. */
  onLoginSuccess?: (redirectTo: string) => void;
  /** Initial error message from OAuth callback redirect */
  initialError?: string;
}

export interface RegisterPageProps {
  onLoginClick?: () => void;
  onGoogleLogin?: () => void;
}

export interface SocialLoginButtonsProps {
  onGoogleLogin?: () => void;
  className?: string;
}
