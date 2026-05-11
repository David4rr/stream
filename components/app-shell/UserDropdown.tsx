"use client";

import { useState, useMemo, useCallback } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { User, LogOut, Heart } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAppSelector, useAppDispatch } from "@/store/hooks";
import { selectUser, selectIsAuthenticated, logout } from "@/store/auth-slice";

const BTN_CLASS =
  "relative w-8 h-8 lg:w-9 lg:h-9 rounded-full bg-gray-100 dark:bg-white/10 border border-gray-300 dark:border-white/50 flex items-center justify-center text-gray-700 dark:text-white";

export function UserDropdown({ mounted }: { mounted: boolean }) {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const user = useAppSelector(selectUser);
  const isAuthenticated = useAppSelector(selectIsAuthenticated);
  // Track which URL errored; resets automatically when avatarUrl changes
  const [erroredUrl, setErroredUrl] = useState<string | null>(null);
  const avatarError = erroredUrl !== null && erroredUrl === user?.avatarUrl;

  const initials = useMemo(() => {
    if (!user?.username) return "U";
    const parts = user.username.trim().split(/\s+/);
    return parts.length >= 2
      ? (parts[0][0] + parts[parts.length - 1][0]).toUpperCase()
      : parts[0][0].toUpperCase();
  }, [user]);

  const handleLogout = useCallback(() => {
    dispatch(logout());
    router.push("/login");
  }, [dispatch, router]);

  if (!mounted || !isAuthenticated) {
    return (
      <Link
        href="/login"
        className={`${BTN_CLASS} hover:bg-gray-200 dark:hover:bg-white/20 transition-colors`}
      >
        <User className="w-3 h-3 lg:w-4 lg:h-4" />
      </Link>
    );
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          className={`${BTN_CLASS} outline-none focus:ring-2 focus:ring-[#3477d7] transition-all overflow-hidden`}
        >
          {user?.avatarUrl && !avatarError ? (
            <img
              src={user.avatarUrl}
              alt="Avatar"
              className="absolute inset-0 w-full h-full object-cover"
              onError={() => setErroredUrl(user?.avatarUrl ?? null)}
            />
          ) : (
            <span className="text-[10px] lg:text-xs font-bold">{initials}</span>
          )}
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56 mt-2">
        <DropdownMenuLabel className="font-normal">
          <p className="text-sm font-medium leading-none">
            {user?.username || "User"}
          </p>
          <p className="text-xs leading-none text-muted-foreground mt-1">
            {user?.email || ""}
          </p>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onSelect={() => router.push("/profile")}
          className="cursor-pointer"
        >
          <User className="mr-2 h-4 w-4" /> Profil
        </DropdownMenuItem>
        <DropdownMenuItem
          onSelect={() => router.push("/favorites")}
          className="cursor-pointer"
        >
          <Heart className="mr-2 h-4 w-4" /> Favorit
        </DropdownMenuItem>
        <DropdownMenuItem
          onSelect={() => window.open("https://trakteer.id/yqh3vvbszxdhvq5epsb0/tip", "_blank", "noopener,noreferrer")}
          className="cursor-pointer"
        >
          <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z"/></svg>
          Support
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onSelect={handleLogout}
          className="text-red-600 dark:text-red-400 focus:text-red-600 dark:focus:text-red-400 cursor-pointer"
        >
          <LogOut className="mr-2 h-4 w-4" /> Keluar
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
