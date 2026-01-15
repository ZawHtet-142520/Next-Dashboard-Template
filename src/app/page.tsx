"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/stores/authStore";

export default function Home() {
  const router = useRouter();
  const { initializeAuth, isTokenExpired } = useAuthStore((state) => ({
    initializeAuth: state.initializeAuth,
    isTokenExpired: state.isTokenExpired,
  }));

  useEffect(() => {
    initializeAuth();
    const token = useAuthStore.getState().token;

    if (token && !isTokenExpired()) {
      router.replace("/dashboard");
    } else {
      router.replace("/login");
    }
  }, [router, initializeAuth, isTokenExpired]);

  return null;
}
