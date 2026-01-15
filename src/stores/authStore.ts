import { create } from "zustand";
import { persist } from "zustand/middleware";
import Cookies from "js-cookie";
import { Admin } from "@/types/auth";

const SECONDS_PER_DAY = 86400;

interface AuthState {
  token: string | null;
  user: Admin | null;
  tokenExpiry: number | null;
  setToken: (token: string, expiresIn?: number) => void;
  setUser: (user: Admin) => void;
  logout: () => void;
  isTokenExpired: () => boolean;
  initializeAuth: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      token: null,
      user: null,
      tokenExpiry: null,
      setToken: (token, expiresIn) => {
        const expiry = expiresIn ? Date.now() + expiresIn * 1000 : null;
        set({ token, tokenExpiry: expiry });
        Cookies.set("token", token, { expires: expiresIn ? expiresIn / SECONDS_PER_DAY : 7 }); // Convert seconds to days
      },
      setUser: (user) => set({ user }),
      logout: () => {
        set({ token: null, user: null, tokenExpiry: null });
        Cookies.remove("token");
      },
      isTokenExpired: () => {
        const { tokenExpiry } = get();
        if (!tokenExpiry) return false;
        return Date.now() > tokenExpiry;
      },
      initializeAuth: () => {
        const token = Cookies.get("token");
        if (token && !get().isTokenExpired()) {
          set({ token });
        } else if (token) {
          // Token exists but expired, clean up
          get().logout();
        }
      },
    }),
    {
      name: "auth-storage",
      partialize: (state) => ({ user: state.user, tokenExpiry: state.tokenExpiry }),
    }
  )
);
