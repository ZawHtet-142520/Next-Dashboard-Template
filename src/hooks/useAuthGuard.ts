"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/stores/authStore";
import { useShallow } from "zustand/react/shallow";

export function useAuthGuard() {
  const router = useRouter();
  const { initializeAuth, isTokenExpired, logout } = useAuthStore(
    useShallow((state) => ({
      initializeAuth: state.initializeAuth,
      isTokenExpired: state.isTokenExpired,
      logout: state.logout,
    }))
  );

  useEffect(() => {
    // Initialize auth state from cookies
    initializeAuth();

    const token = useAuthStore.getState().token;

    if (!token || isTokenExpired()) {
      logout();
      router.replace("/login");
    }
  }, [router, initializeAuth, isTokenExpired, logout]);
}
