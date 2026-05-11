"use client";

import { useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import LoginPage from "@/components/auth/login-page";
import { useAppSelector } from "@/store/hooks";
import { selectIsAuthenticated } from "@/store/auth-slice";
import { getGoogleOAuthUrl } from "@/app/actions/auth/google-auth";

// Error message mapping for OAuth errors
const OAUTH_ERROR_MESSAGES: Record<string, string> = {
  access_denied: "Anda membatalkan login dengan Google",
  missing_oauth_params: "Parameter OAuth tidak valid",
  exchange_failed: "Gagal memproses login dengan Google",
};

function getOAuthErrorMessage(errorCode: string | null): string | null {
  if (!errorCode) return null;
  return OAUTH_ERROR_MESSAGES[errorCode] ?? `Terjadi kesalahan: ${errorCode}`;
}

function LoginContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const isAuthenticated = useAppSelector(selectIsAuthenticated);

  // Support both ?redirect= (middleware) and ?callback= (AuthGuard)
  const redirectTo =
    searchParams.get("redirect") ?? searchParams.get("callback") ?? "/beranda";

  // Check for OAuth error in URL
  const oauthError = getOAuthErrorMessage(searchParams.get("error"));

  const handleGoogleLogin = async () => {
    const result = await getGoogleOAuthUrl();
    if (result.success) {
      window.location.href = result.authUrl;
    } else {
    }
  };

  const handleRegisterClick = () => {
    router.push("/register");
  };

  const handleLoginSuccess = () => {
    router.replace(redirectTo);
  };

  useEffect(() => {
    if (isAuthenticated) {
      router.replace(redirectTo);
    }
  }, [isAuthenticated, router, redirectTo]);

  // Clear error from URL after displaying
  useEffect(() => {
    if (oauthError) {
      router.replace("/login");
    }
  }, [oauthError, router]);

  if (isAuthenticated) {
    return null;
  }

  return (
    <LoginPage
      onGoogleLogin={handleGoogleLogin}
      onRegisterClick={handleRegisterClick}
      onLoginSuccess={handleLoginSuccess}
      initialError={oauthError ?? undefined}
    />
  );
}

// Wrap with Suspense for useSearchParams
export default function LoginPageDemo() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading...</div>}>
      <LoginContent />
    </Suspense>
  );
}
