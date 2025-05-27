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
    <div className="flex h-screen">
      <Sidebar />

      <div className="flex-1 flex flex-col relative overflow-y-auto">
        {!mounted ? (
          <div className="sticky top-0 z-20 px-4 pt-4 bg-gray-100 dark:bg-[#25293C]">
            <div className="flex items-center justify-between p-4 border-b shadow-sm rounded-lg bg-white dark:bg-gray-600 animate-pulse">
              <div className="w-6 h-6 bg-gray-300 dark:bg-gray-600 rounded-md" />
              <div className="flex items-center gap-4">
                <div className="w-5 h-5 bg-gray-300 dark:bg-gray-600 rounded-full" />
                <div className="w-5 h-5 bg-gray-300 dark:bg-gray-600 rounded-full" />
                <div className="w-8 h-8 bg-gray-300 dark:bg-gray-600 rounded-full" />
              </div>
            </div>
          </div>
        ) : (
          <div className="sticky top-0 z-20 backdrop-blur bg-gray-100 dark:bg-[#25293C] px-4 pt-4">
            <TopNavbar />
          </div>
        )}

        <div className="flex-1 p-4 bg-gray-100 dark:bg-[#25293C]">
          <main className="bg-white dark:bg-[#2F3349] border rounded-lg shadow p-4 min-h-[200px]">
            {children}
          </main>
        </div>
      </div>
    </div>
  );
}
