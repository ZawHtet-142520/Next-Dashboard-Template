"use client";

import { ReactNode, useEffect, useState } from "react";
import TopNavbar from "@/components/layouts/TopNavbar";
import Sidebar from "@/components/layouts/Sidebar";
import { useAuthGuard } from "@/hooks/useAuthGuard";

export default function DashboardLayout({ children }: { children: ReactNode }) {
  useAuthGuard();

  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const timeout = setTimeout(() => setMounted(true), 100);
    return () => clearTimeout(timeout);
  }, []);

  return (
    <div className="flex h-screen bg-transparent">
      <Sidebar />

      <div className="relative flex flex-1 flex-col overflow-y-auto">
        {!mounted ? (
          <div className="sticky top-0 z-20 px-4 pt-4 bg-transparent">
            <div className="flex items-center justify-between rounded-2xl border border-border/60 bg-card/85 p-4 shadow-sm backdrop-blur-sm animate-pulse">
              <div className="w-6 h-6 bg-gray-300 dark:bg-gray-600 rounded-md" />
              <div className="flex items-center gap-4">
                <div className="w-5 h-5 bg-gray-300 dark:bg-gray-600 rounded-full" />
                <div className="w-5 h-5 bg-gray-300 dark:bg-gray-600 rounded-full" />
                <div className="w-8 h-8 bg-gray-300 dark:bg-gray-600 rounded-full" />
              </div>
            </div>
          </div>
        ) : (
          <div className="sticky top-0 z-20 bg-transparent px-4 pt-4">
            <TopNavbar />
          </div>
        )}

        <div className="flex-1 p-4 bg-transparent">
          <main className="min-h-[200px] rounded-2xl border border-border/70 bg-card p-4 shadow-[0_10px_40px_-24px_rgba(10,14,45,0.65)]">
            {children}
          </main>
        </div>
      </div>

      {/* Modal Portal Container - renders modals at full viewport */}
      <div id="modal-root" className="pointer-events-none" />
    </div>
  );
}
