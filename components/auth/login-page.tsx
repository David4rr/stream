"use client";

import React, { useState, useCallback, type FormEvent } from "react";
import { loginSchema } from "@/lib/schemas/auth";
import { useRouter } from "next/navigation";
import { UserIcon, PasswordIcon } from "@/components/icons";
import { Button } from "@/components/ui/button";
import { AuthLayoutWrapper } from "@/components/ui/auth-layout-wrapper";
import AuthBackground from "@/components/ui/auth-background";
import AuthImageGrid from "@/components/ui/auth-image-grid";
import AuthFooter from "@/components/ui/auth-footer";
import { AuthHeader } from "./AuthHeader";
import { AuthInputField } from "./AuthInputField";
import { PasswordInputField } from "./PasswordInputField";
import { SocialLoginButtons } from "./SocialLoginButtons";
import { AuthFormContainer } from "./AuthFormContainer";
import { authButtonStyles } from "./styles";
import { useAppSelector, useAppDispatch } from "@/store/hooks";
import {
  selectAuthStatus,
  selectAuthError,
  resetStatus,
  login,
  fetchUser,
} from "@/store/auth-slice";
import { LoginPageProps } from "./types";

export default function LoginPage({
  onGoogleLogin,
  onRegisterClick,
  onLoginSuccess,
  initialError,
}: LoginPageProps) {
  const router = useRouter();
  const dispatch = useAppDispatch();

  const authStatus = useAppSelector(selectAuthStatus);
  const authError = useAppSelector(selectAuthError);
  const [formData, setFormData] = useState({ username: "", password: "" });
  const [localErrors, setLocalErrors] = useState<Record<string, string>>({});
  const [oauthError, setOauthError] = useState<string | undefined>(initialError);

  const isSubmitting = authStatus === "loading";
  const showErrorMessage = (authStatus === "error" && authError) || oauthError;

  const handleSubmit = useCallback(
    async (e: FormEvent) => {
      e.preventDefault();

      const validation = loginSchema.safeParse(formData);
      if (!validation.success) {
        const errors: Record<string, string> = {};
        validation.error.issues.forEach((err) => {
          if (err.path[0]) {
            errors[err.path[0] as string] = err.message;
          }
        });
        setLocalErrors(errors);
        return;
      }

      setLocalErrors({});
      try {
        const result = await dispatch(login(formData)).unwrap();

        // Fetch full user data including avatarUrl after login
        await dispatch(fetchUser());

        if (onLoginSuccess) {
          onLoginSuccess("/beranda");
        } else {
          router.push("/beranda");
        }
      } catch (error) {
        if (process.env.NODE_ENV === 'development') {
          console.error('Login failed:', error);
        }
      }
    },
    [dispatch, formData, router, onLoginSuccess],
  );

  const handleInputChange = useCallback(
    (field: keyof typeof formData) =>
      (e: React.ChangeEvent<HTMLInputElement>) => {
        if (showErrorMessage) {
          dispatch(resetStatus());
          setOauthError(undefined);
        }
        if (localErrors[field])
          setLocalErrors((prev) => ({ ...prev, [field]: "" }));
        setFormData((prev) => ({ ...prev, [field]: e.target.value }));
      },
    [dispatch, showErrorMessage, localErrors],
  );

  return (
    <AuthLayoutWrapper variant="login">
      <div className="relative z-10 w-full px-4 lg:px-0">
        <AuthFormContainer onSubmit={handleSubmit}>
          {/* Main Content Area */}
          <div className="relative z-20 flex flex-col px-6 py-6 lg:p-0 lg:pl-20 lg:pt-[90px] lg:w-1/2">
            {/* Header Section */}
            <div className="mb-4 lg:mb-0">
              {/* Mobile Header (Unified with Desktop visually via classes) */}
              <div className="lg:hidden">
                <AuthHeader
                  title="Selamat Datang"
                  subtitle="Silakan masukkan username dan kata sandi untuk Masuk"
                />
              </div>

              {/* Desktop Header Text (Hidden on mobile to use AuthHeader, or unified?)
                  AuthHeader uses specific styles. Let's keep of exact text structure for desktop
                  to ensure "Zero Visual Change" if AuthHeader differs.
                  AuthHeader: title=text-2xl font-semibold, subtitle=text-sm text-gray-500.
                  Original Desktop: title=text-xl font-semibold, subtitle=text-xs text-[#8c8c8c].
                  They differ slightly. We will render specific desktop DOM to match original pixel-perfect.
              */}
              <div className="hidden lg:block">
                <p className="text-xl font-semibold text-black dark:text-white">
                  Selamat Datang
                </p>
                <div className="mt-[5px] w-[249px]">
                  <p className="text-xs text-[#8c8c8c] dark:text-gray-400">
                    Silakan masukkan username dan kata sandi untuk Masuk
                  </p>
                </div>
              </div>
            </div>

            {/* Error Message */}
            {showErrorMessage && (
              <div className="mt-4 -mb-2 lg:mb-0 lg:w-[286px] animate-in fade-in slide-in-from-top-1 duration-300">
                <p className="text-xs text-red-500 dark:text-red-400 text-center lg:text-left font-medium bg-red-50/50 dark:bg-red-950/20 py-2 px-3 rounded-md border border-red-100 dark:border-red-900/30">
                  {oauthError || authError}
                </p>
              </div>
            )}

            {/* Form Inputs */}
            <div className="flex flex-col gap-4 lg:gap-6 mt-6 lg:mt-8">
              <div className="lg:w-[286px]">
                <AuthInputField
                  type="text"
                  name="username"
                  placeholder="Nama atau username"
                  value={formData.username}
                  onChange={handleInputChange("username")}
                  icon={<UserIcon />}
                  required
                  autoComplete="username"
                />
                {localErrors.username && (
                  <p className="text-xs text-red-500 dark:text-red-400 mt-1">
                    {localErrors.username}
                  </p>
                )}
              </div>

              <div className="lg:w-[286px]">
                <PasswordInputField
                  name="password"
                  placeholder="Masukkan password"
                  value={formData.password}
                  onChange={handleInputChange("password")}
                  icon={<PasswordIcon />}
                  required
                  autoComplete="current-password"
                />
                {localErrors.password && (
                  <p className="text-xs text-red-500 dark:text-red-400 mt-1">
                    {localErrors.password}
                  </p>
                )}
              </div>
            </div>

            {/* Actions & Buttons */}
            <div className="mt-6 lg:mt-10 lg:w-[260px]">
              <Button
                type="submit"
                disabled={isSubmitting}
                className={`w-full py-3.5 lg:h-[37.93px] ${authButtonStyles.primary} text-sm lg:text-base`}
              >
                {isSubmitting ? "Memproses..." : "Masuk"}
              </Button>

              <div className="mt-6 lg:mt-[22px]">
                <SocialLoginButtons onGoogleLogin={onGoogleLogin} />

                <div className="text-center text-xs text-[#8c8c8c] dark:text-gray-400 mt-6">
                  Belum terdaftar?
                  <Button
                    type="button"
                    variant="link"
                    onClick={onRegisterClick}
                    className={`ml-1 text-xs ${authButtonStyles.link}`}
                  >
                    Daftar
                  </Button>
                </div>
              </div>
            </div>
          </div>

          {/* Background Visuals (Desktop Only) */}
          <div className="hidden lg:block">
            <AuthBackground />
            <AuthImageGrid />
          </div>
        </AuthFormContainer>
      </div>

      <AuthFooter />
    </AuthLayoutWrapper>
  );
}
