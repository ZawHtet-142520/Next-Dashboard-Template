"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useDashboardStore } from "@/stores/useDashboardStore";
import { sidebarLinks } from "@/data/sidebarLinks";
import { ChevronDown, ChevronRight, DotIcon } from "lucide-react";
import { useEffect, useState } from "react";
import type { SidebarLink } from "@/types/sidebar";

export default function Sidebar() {
  const { sidebarOpen, setSidebarOpen, mainOpen } = useDashboardStore();
  const pathname = usePathname();
  const [openDropdown, setOpenDropdown] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);

  const handleDropdownClick = (idx: number) => {
    setOpenDropdown(openDropdown === idx ? null : idx);
  };

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 100);

    const activeParentIndex = sidebarLinks.findIndex((item) =>
      item.children?.some((child) => child.href === pathname),
    );
    if (activeParentIndex !== -1) {
      setOpenDropdown(activeParentIndex);
    }

    return () => clearTimeout(timer);
  }, [pathname]);

  return (
    <aside
      className={`bg-white shadow border-r dark:border-r-0 transition-all duration-300 ease-in-out
      ${sidebarOpen ? "w-[250px]" : "w-[80px]"}
      flex flex-col h-screen`}
    >
      <div className="flex items-center justify-center h-16 sticky top-0 bg-white z-10 dark:bg-[#2F3349] text-gray-700 dark:text-white">
        {sidebarOpen ? (
          <h2 className="text-2xl font-bold text-nowrap">Mail Dashboard</h2>
        ) : (
          <span className="text-2xl">MVS</span>
        )}
      </div>

      <nav
        onMouseEnter={() => {
          if (!sidebarOpen) {
            setSidebarOpen(true);
          }
        }}
        onMouseLeave={() => {
          if (!mainOpen) {
            setSidebarOpen(false);
          }
        }}
        className="flex-1 overflow-y-auto px-4 pt-4 space-y-2 dark:bg-[#2F3349] dark:text-white scrollbar scrollbar-thumb-rounded-md scrollbar-thumb-blue-500"
      >
        {loading
          ? Array.from({ length: 15 }).map((_, i) => (
              <div
                key={i}
                className="h-10 rounded bg-gray-200 dark:bg-gray-700 animate-pulse"
              />
            ))
          : sidebarLinks.map((item: SidebarLink, idx: number) => (
              <div key={idx}>
                {item.children ? (
                  <div className="space-y-2">
                    <button
                      onClick={() => handleDropdownClick(idx)}
                      className="flex items-center justify-between w-full text-gray-700 dark:text-white font-semibold px-2 py-2 rounded hover:bg-blue-400"
                    >
                      <div className="flex items-center gap-3">
                        <item.icon className="w-5 h-5 dark:text-white" />
                        {sidebarOpen && <span>{item.label}</span>}
                      </div>
                      {sidebarOpen &&
                        (openDropdown === idx ? (
                          <ChevronDown className="w-4 h-4 dark:text-white" />
                        ) : (
                          <ChevronRight className="w-4 h-4 dark:text-white" />
                        ))}
                    </button>
                    {sidebarOpen && openDropdown === idx && (
                      <div className="ml-2 space-y-1 animate-slide-down">
                        {item.children.map((child, ci) => (
                          <Link
                            key={ci}
                            href={child.href}
                            className={`block px-2 py-2 rounded hover:bg-blue-400 ${
                              pathname === child.href
                                ? "bg-[#9087F3] font-medium"
                                : ""
                            }`}
                          >
                            <div className="flex items-center gap-3">
                              <span className="flex items-center gap-2 text-gray-700 dark:text-white text-nowrap">
                                <DotIcon />
                                {child.label}
                              </span>
                            </div>
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>
                ) : (
                  <Link
                    href={item.href!}
                    className={`flex items-center gap-3 px-2 py-2 rounded group ${
                      pathname === item.href ? "bg-[#9087F3] font-medium" : ""
                    }`}
                  >
                    <item.icon className="w-5 h-5 text-gray-700 dark:text-white" />
                    {sidebarOpen && (
                      <span className="text-gray-700 dark:text-white">
                        {item.label}
                      </span>
                    )}
                  </Link>
                )}
              </div>
            ))}
      </nav>
    </aside>
  );
}
