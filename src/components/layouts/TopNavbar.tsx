"use client";

import { useDashboardStore } from "@/stores/useDashboardStore";
import { Menu, Moon, Sun } from "lucide-react";
import ProfileDropdown from "./ProfileDropdown";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

export default function TopNavbar() {
  const { toggleSidebar } = useDashboardStore();
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  const currentTheme = resolvedTheme ?? "light";

  // Avoid hydration mismatch
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="sticky top-0 z-10 flex items-center justify-between rounded-2xl border border-border/60 bg-card/85 p-4 shadow-sm backdrop-blur-sm animate-pulse">
        <div className="w-6 h-6 bg-gray-300 dark:bg-gray-600 rounded-md" />
        <div className="flex items-center gap-4">
          <div className="w-5 h-5 bg-gray-300 dark:bg-gray-600 rounded-full" />
          <div className="w-5 h-5 bg-gray-300 dark:bg-gray-600 rounded-full" />
          <div className="w-8 h-8 bg-gray-300 dark:bg-gray-600 rounded-full" />
        </div>
      </div>
    );
  }

  return (
    <div className="sticky top-0 z-10 flex items-center justify-between rounded-2xl border border-border/60 bg-card/85 p-4 text-foreground shadow-sm backdrop-blur-sm">
      <button
        className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-border/70 bg-background/70 text-foreground transition-colors hover:bg-accent"
        onClick={toggleSidebar}
        aria-label="Toggle Sidebar"
      >
        <Menu className="w-6 h-6" />
      </button>

      <div className="flex items-center gap-4">
        <button
          onClick={() => alert("No new notifications")}
          className="relative inline-flex h-9 w-9 items-center justify-center rounded-lg border border-border/70 bg-background/70 text-foreground transition-colors hover:bg-accent"
          aria-label="Notifications"
        >
          <Bell className="w-5 h-5" />
          <span className="absolute right-1.5 top-1.5 block h-2 w-2 rounded-full bg-red-500 shadow-[0_0_0_2px_rgba(255,255,255,0.5)] animate-ping" />
          <span className="absolute right-1.5 top-1.5 block h-2 w-2 rounded-full bg-red-500" />
        </button>

        <button
          onClick={() => setTheme(currentTheme === "dark" ? "light" : "dark")}
          className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-border/70 bg-background/70 text-foreground transition-colors hover:bg-accent"
          aria-label="Toggle Dark Mode"
        >
          {currentTheme === "dark" ? (
            <Sun className="w-5 h-5" />
          ) : (
            <Moon className="w-5 h-5" />
          )}
        </button>

        <ProfileDropdown />
      </div>
    </div>
  );
}
