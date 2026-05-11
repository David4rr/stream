"use client";

import { useCallback, useMemo, useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { logout, selectUser, selectIsAuthenticated } from "@/store/auth-slice";
import {
  ProfileSidebar,
  SecurityTab,
  AccountTab,
  AboutTab,
  ProfileTab,
} from "@/components/profile";

export default function ProfilePage() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const user = useAppSelector(selectUser);
  const isAuthenticated = useAppSelector(selectIsAuthenticated);
  const [activeTab, setActiveTab] = useState<ProfileTab>("account");
  const mountedRef = useRef(false);
  const [shouldRender, setShouldRender] = useState(false);

  // All hooks must be called before any early returns (Rules of Hooks)
  const userInitial = useMemo(
    () => user?.displayName?.[0]?.toUpperCase() || user?.username?.[0]?.toUpperCase() || "U",
    [user?.displayName, user?.username]
  );
  const displayName = useMemo(
    () => user?.displayName || user?.username || "User",
    [user?.displayName, user?.username]
  );
  const userName = useMemo(() => user?.username || "", [user?.username]);
  const userEmail = useMemo(() => user?.email || "", [user?.email]);
  const avatarUrl = useMemo(() => user?.avatarUrl, [user?.avatarUrl]);
  const subscriptionType = useMemo(() => user?.subscriptionType, [user?.subscriptionType]);
  const createdAt = useMemo(() => user?.createdAt, [user?.createdAt]);
  const userId = useMemo(() => user?.id, [user?.id]);

  const handleLogout = useCallback(async () => {
    await dispatch(logout());
    router.push("/login");
  }, [dispatch, router]);

  useEffect(() => {
    // Defer setState to avoid synchronous call warning
    const rafId = requestAnimationFrame(() => {
      mountedRef.current = true;
      setShouldRender(true);
    });
    return () => cancelAnimationFrame(rafId);
  }, []);

  useEffect(() => {
    if (mountedRef.current && !isAuthenticated) {
      router.push("/login");
    }
  }, [isAuthenticated, router]);

  // Early returns after all hooks
  if (!shouldRender) {
    return null;
  }

  if (!isAuthenticated || !user) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p className="text-foreground">Loading...</p>
      </div>
    );
  }

  return (
    <div className="w-full max-w-6xl mx-auto px-4 lg:px-8 py-8 lg:py-12 lg:pt-20 pt-20">
      <h1 className="text-2xl lg:text-3xl font-bold text-foreground mb-8">Profil</h1>

      <section className="rounded-3xl border border-border bg-card/40 dark:bg-zinc-900/40 backdrop-blur-md overflow-hidden shadow-xl">
        <div className="flex flex-col lg:flex-row">
          <ProfileSidebar
            userInitial={userInitial}
            displayName={displayName}
            userEmail={userEmail}
            avatarUrl={avatarUrl}
            activeTab={activeTab}
            onTabChange={setActiveTab}
            onLogout={handleLogout}
          />

          <section className="flex-1 p-6 lg:p-8">
            {activeTab === "security" && <SecurityTab userId={userId} createdAt={createdAt} />}
            {activeTab === "account" && (
              <AccountTab
                displayName={displayName}
                userEmail={userEmail}
                userName={userName}
                subscriptionType={subscriptionType}
                userId={userId}
                dispatch={dispatch}
              />
            )}
            {activeTab === "about" && <AboutTab />}
          </section>
        </div>
      </section>
    </div>
  );
}
