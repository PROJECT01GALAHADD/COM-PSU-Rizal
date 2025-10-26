"use client";

import React, { createContext, useContext, useEffect, useMemo, useState } from "react";

export type Profile = {
  id: string;
  email: string;
  firstName?: string | null;
  lastName?: string | null;
  userType?: "admin" | "faculty" | "student" | "guest";
  isActive?: boolean;
};

const fetcher = async (url: string) => {
  const res = await fetch(url, { credentials: "include" });
  if (!res.ok) {
    throw new Error(`Failed to fetch ${url}: ${res.status}`);
  }
  return res.json();
};

export type ProfileContextValue = {
  profile: Profile | null;
  isLoading: boolean;
  refresh: () => Promise<void>;
};

const ProfileContext = createContext<ProfileContextValue | undefined>(undefined);

function getDemoUser(): Profile | null {
  try {
    const raw = typeof window !== "undefined" ? localStorage.getItem("com_demo_auth_v1") : null;
    if (!raw) return null;
    const u = JSON.parse(raw);
    return { id: u.id || "demo", email: u.email || "demo@local", userType: u.role as any };
  } catch {
    return null;
  }
}

export function ProfileProvider({ children }: { children: React.ReactNode }) {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const refresh = async () => {
    setIsLoading(true);
    try {
      // Demo-mode guard: if demo user exists, skip API fetch
      const demo = getDemoUser();
      if (demo) {
        setProfile(demo);
        return;
      }
      // Fetch user profile from JWT-authenticated API
      const data = await fetcher("/api/users/me");
      setProfile(data?.user ?? null);
    } catch (err) {
      // If API call fails, clear profile (user not authenticated)
      setProfile(null);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    // Initial fetch
    refresh();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const value = useMemo<ProfileContextValue>(() => ({ profile, isLoading, refresh }), [profile, isLoading]);

  return <ProfileContext.Provider value={value}>{children}</ProfileContext.Provider>;
}

export function useProfileContext() {
  const ctx = useContext(ProfileContext);
  if (!ctx) throw new Error("useProfileContext must be used within ProfileProvider");
  return ctx;
}

export function useProfileSWR() {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const refresh = async () => {
    setIsLoading(true);
    try {
      const demo = getDemoUser();
      if (demo) {
        setProfile(demo);
        return;
      }
      const data = await fetcher("/api/users/me");
      setProfile(data?.user ?? null);
    } catch (_) {
      setProfile(null);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    refresh();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return { profile, isLoading, refresh } as ProfileContextValue;
}