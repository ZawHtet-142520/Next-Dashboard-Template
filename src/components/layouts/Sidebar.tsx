"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useDashboardStore } from "@/stores/useDashboardStore";
import { sidebarLinks } from "@/data/sidebarLinks";
import { ChevronDown, ChevronRight, DotIcon } from "lucide-react";
import { useEffect, useState } from "react";
import type { SidebarLink } from "@/types/sidebar";

export default function Sidebar() {
  const { sidebarOpen } = useDashboardStore();
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
      className={`border-r border-sidebar-border bg-sidebar text-sidebar-foreground shadow-[0_0_40px_-28px_rgba(8,12,34,0.8)] transition-all duration-300 ease-in-out
      ${sidebarOpen ? "w-[250px]" : "w-[80px]"}
      flex flex-col h-screen`}
    >
      <div className="sticky top-0 z-10 flex h-16 items-center justify-center border-b border-sidebar-border bg-sidebar">
        {sidebarOpen ? (
          <h2 className="text-nowrap text-2xl font-bold text-sidebar-foreground">
            Mail Dashboard
          </h2>
        ) : (
          <span className="text-xl font-bold text-sidebar-foreground">M</span>
        )}
      </div>

      <nav
        className={`flex-1 overflow-y-auto pt-4 space-y-2 bg-sidebar scrollbar scrollbar-thumb-rounded-md scrollbar-thumb-slate-400/70 ${
          sidebarOpen ? "px-4" : "px-2"
        }`}
      >
        {loading
          ? Array.from({ length: 15 }).map((_, i) => (
              <div key={i} className="h-10 rounded bg-gray-400 animate-pulse" />
            ))
          : sidebarLinks.map((item: SidebarLink, idx: number) => (
              <div key={idx}>
                {item.children ? (
                  <div className="space-y-2">
                    {(() => {
                      const hasActiveChild = item.children.some(
                        (child) => child.href === pathname,
                      );
                      const parentStateClass = hasActiveChild
                        ? sidebarOpen
                          ? "bg-sidebar-primary/15 text-sidebar-primary"
                          : "bg-sidebar-primary text-sidebar-primary-foreground"
                        : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground";

                      return (
                        <button
                          onClick={() => handleDropdownClick(idx)}
                          className={`flex items-center w-full font-semibold rounded transition-colors ${parentStateClass} ${
                            sidebarOpen
                              ? "justify-between px-2 py-2"
                              : "mx-auto h-11 w-11 justify-center p-0"
                          }`}
                        >
                          <div
                            className={`flex items-center ${
                              sidebarOpen ? "gap-3" : "justify-center"
                            }`}
                          >
                            <item.icon className="w-5 h-5" />
                            {sidebarOpen && <span>{item.label}</span>}
                          </div>
                          {sidebarOpen &&
                            (openDropdown === idx ? (
                              <ChevronDown className="w-4 h-4" />
                            ) : (
                              <ChevronRight className="w-4 h-4" />
                            ))}
                        </button>
                      );
                    })()}
                    {sidebarOpen && openDropdown === idx && (
                      <div className="ml-2 space-y-1 animate-slide-down">
                        {item.children.map((child, ci) => (
                          <Link
                            key={ci}
                            href={child.href}
                            className={`block px-2 py-2 rounded transition-colors ${
                              pathname === child.href
                                ? "bg-sidebar-primary text-sidebar-primary-foreground font-medium"
                                : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                            }`}
                          >
                            <div className="flex items-center gap-3">
                              <span className="flex items-center gap-2 text-nowrap">
                                <DotIcon className="h-4 w-4" />
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
                    className={`flex items-center rounded group transition-colors ${
                      pathname === item.href
                        ? "bg-sidebar-primary text-sidebar-primary-foreground font-medium"
                        : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                    } ${
                      sidebarOpen
                        ? "gap-3 px-2 py-2"
                        : "mx-auto h-11 w-11 justify-center p-0"
                    }`}
                  >
                    <item.icon className="w-5 h-5" />
                    {sidebarOpen && <span>{item.label}</span>}
                  </Link>
                )}
              </div>
            ))}
      </nav>
    </aside>
  );
}
