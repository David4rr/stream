"use client";

import React, { useState, useCallback, type FormEvent } from "react";
import { registerSchema } from "@/lib/schemas/auth";
import { useRouter } from "next/navigation";
import { UserIcon, EmailIcon, LockIcon } from "@/components/icons";
import { Button } from "@/components/ui/button";
import { AuthLayoutWrapper } from "@/components/ui/auth-layout-wrapper";
import AuthBackground from "@/components/ui/auth-background";
import AuthImageGrid from "@/components/ui/auth-image-grid";
import AuthFooter from "@/components/ui/auth-footer";
import { AuthHeader } from "./AuthHeader";
import { AuthInputField } from "./AuthInputField";
import { PasswordInputField } from "./PasswordInputField";
import { AuthFormContainer } from "./AuthFormContainer";
import { SocialLoginButtons } from "./SocialLoginButtons";
import { authButtonStyles } from "./styles";
import { useAppSelector, useAppDispatch } from "@/store/hooks";
import {
  selectAuthStatus,
  selectAuthError,
  selectFieldErrors,
  resetStatus,
  register,
  fetchUser,
} from "@/store/auth-slice";
import { RegisterPageProps } from "./types";

export default function RegisterPage({
  onLoginClick,
  onGoogleLogin,
}: RegisterPageProps) {
  const router = useRouter();
  const dispatch = useAppDispatch();

  const authStatus = useAppSelector(selectAuthStatus);
  const authError = useAppSelector(selectAuthError);
  const fieldErrors = useAppSelector(selectFieldErrors);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [localErrors, setLocalErrors] = useState<Record<string, string>>({});

  const isSubmitting = authStatus === "loading";
  const showErrorMessage = authStatus === "error" && authError;

  const handleSubmit = useCallback(
    async (e: FormEvent) => {
      e.preventDefault();

      const validation = registerSchema.safeParse(formData);
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
        await dispatch(register(formData)).unwrap();
        // Fetch full user data including avatarUrl after register
        await dispatch(fetchUser());
        router.push("/beranda");
      } catch {
        // Error sudah ditangani di Redux slice
      }
    },
    [dispatch, formData, router],
  );

  const handleInputChange = useCallback(
    (field: keyof typeof formData) =>
      (e: React.ChangeEvent<HTMLInputElement>) => {
        if (showErrorMessage) dispatch(resetStatus());
        if (localErrors[field])
          setLocalErrors((prev) => ({ ...prev, [field]: "" }));
        setFormData((prev) => ({ ...prev, [field]: e.target.value }));
      },
    [dispatch, showErrorMessage, localErrors],
  );

  return (
    <AuthLayoutWrapper variant="register">
      <div className="relative z-10 w-full px-4 lg:px-0">
        <AuthFormContainer onSubmit={handleSubmit}>
          {/* Main Content Area */}
          <div className="relative z-20 flex flex-col px-5 py-5 lg:p-0 lg:pl-20 lg:pt-[90px] lg:w-1/2">
            {/* Header Section */}
            <div className="mb-3 lg:mb-0">
              {/* Mobile Header */}
              <div className="lg:hidden">
                <AuthHeader
                  title="Buat Akun"
                  subtitle="Silakan masukkan informasi Anda dan buat akun Anda"
                />
              </div>

              {/* Desktop Header Text (Pixel perfect match) */}
              <div className="hidden lg:block">
                <p className="text-xl font-semibold text-black dark:text-white">
                  Buat Akun
                </p>
                <div className="mt-[5px] w-[249px]">
                  <p className="text-sm text-[#8c8c8c] dark:text-gray-400">
                    Silakan masukkan informasi Anda dan buat akun Anda
                  </p>
                </div>
              </div>
            </div>

            {/* Error Message */}
            {showErrorMessage && (
              <div className="mb-2 lg:mb-0 lg:absolute lg:top-[160px] lg:w-[260px]">
                <p className="text-xs text-red-500 dark:text-red-400 text-center lg:text-left">
                  {authError}
                </p>
              </div>
            )}

            {/* Form Fields */}
            <div className="flex flex-col gap-3 lg:gap-5 lg:mt-16 lg:w-[260px]">
              <div className="space-y-1.5 lg:space-y-0">
                <AuthInputField
                  type="text"
                  name="name"
                  placeholder="Masukkan nama"
                  value={formData.name}
                  onChange={handleInputChange("name")}
                  icon={<UserIcon />}
                  required
                  autoComplete="name"
                  className="h-11 sm:h-12 lg:h-auto"
                />
                {(localErrors.name || fieldErrors.name) && (
                  <p className="text-xs text-red-500 dark:text-red-400 mt-1">
                    {localErrors.name || fieldErrors.name}
                  </p>
                )}
              </div>

              <div className="space-y-1.5 lg:space-y-0">
                <AuthInputField
                  type="email"
                  name="email"
                  placeholder="Masukkan email"
                  value={formData.email}
                  onChange={handleInputChange("email")}
                  icon={<EmailIcon />}
                  required
                  autoComplete="email"
                  className="h-11 sm:h-12 lg:h-auto"
                />
                {(localErrors.email || fieldErrors.email) && (
                  <p className="text-xs text-red-500 dark:text-red-400 mt-1">
                    {localErrors.email || fieldErrors.email}
                  </p>
                )}
              </div>

              <div className="space-y-1.5 lg:space-y-0">
                <PasswordInputField
                  name="password"
                  placeholder="Masukkan password"
                  value={formData.password}
                  onChange={handleInputChange("password")}
                  icon={<LockIcon />}
                  required
                  autoComplete="new-password"
                  className="h-11 sm:h-12 lg:h-auto"
                />
                {(localErrors.password || fieldErrors.password) && (
                  <p className="text-xs text-red-500 dark:text-red-400 mt-1">
                    {localErrors.password || fieldErrors.password}
                  </p>
                )}
              </div>

              {/* Submit Button */}
              <Button
                type="submit"
                disabled={isSubmitting}
                className={`w-full mt-2 h-12 lg:h-[37.93px] ${authButtonStyles.primary} text-sm lg:text-base`}
              >
                {isSubmitting ? "Memproses..." : "Daftar"}
              </Button>

              {/* Social Login Buttons */}
              {onGoogleLogin && (
                <SocialLoginButtons
                  onGoogleLogin={onGoogleLogin}
                  className="mt-4 lg:mt-6"
                />
              )}

              {/* Login Link */}
              <div className="text-center text-xs lg:text-xs text-[#8c8c8c] dark:text-gray-400 mt-2 lg:mt-0">
                <span>Sudah punya akun?</span>
                <Button
                  type="button"
                  variant="link"
                  onClick={onLoginClick}
                  className={`ml-1 text-xs sm:text-sm lg:text-xs ${authButtonStyles.link}`}
                >
                  Login
                </Button>
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
