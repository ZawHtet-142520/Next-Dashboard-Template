"use client";

import { useDashboardStore } from "@/stores/useDashboardStore";
import { Menu, Moon, Sun } from "lucide-react";
import ProfileDropdown from "./ProfileDropdown";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

export default function TopNavbar() {
  const { toggleSidebar } = useDashboardStore();
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  // Avoid hydration mismatch
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="flex items-center justify-between p-4 border-b shadow-sm sticky top-0 rounded-lg bg-white dark:bg-[#2F3349] z-10 animate-pulse">
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
    <div className="flex items-center justify-between p-4 border-b shadow-sm sticky top-0 rounded-lg bg-white dark:bg-[#2F3349] dark:text-white z-10">
      <button
        className="text-gray-700 dark:text-white"
        onClick={toggleSidebar}
        aria-label="Toggle Sidebar"
      >
        <Menu className="w-6 h-6" />
      </button>

      <div className="flex items-center gap-4">
        {/* Theme toggle button */}
        <button
          onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
          className="text-gray-700 dark:text-white"
          aria-label="Toggle Dark Mode"
        >
          {theme === "dark" ? (
            <Sun className="w-5 h-5" />
          ) : (
            <Moon className="w-5 h-5" />
          )}
        </button>

        {/* Profile dropdown */}
        <ProfileDropdown />
      </div>
    </div>
  );
}
