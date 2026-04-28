"use client";

import Link from "next/link";
import { createPortal } from "react-dom";
import { usePathname } from "next/navigation";
import { useDashboardStore } from "@/stores/useDashboardStore";
import { sidebarLinks } from "@/data/sidebarLinks";
import { ChevronDown, ChevronRight, DotIcon } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import type { SidebarLink } from "@/types/sidebar";

export default function Sidebar() {
  const { sidebarOpen } = useDashboardStore();
  const pathname = usePathname();
  const [openDropdown, setOpenDropdown] = useState<number | null>(null);
  const [floatingMenuPosition, setFloatingMenuPosition] = useState<{
    top: number;
    left: number;
  } | null>(null);
  const [hoverLabel, setHoverLabel] = useState<string | null>(null);
  const [hoverLabelPosition, setHoverLabelPosition] = useState<{
    top: number;
    left: number;
  } | null>(null);
  const [loading, setLoading] = useState(true);
  const sidebarRef = useRef<HTMLElement | null>(null);
  const floatingMenuRef = useRef<HTMLDivElement | null>(null);
  const floatingLabelRef = useRef<HTMLDivElement | null>(null);
  const itemButtonRefs = useRef<Array<HTMLButtonElement | null>>([]);
  const closeTimerRef = useRef<number | null>(null);

  const clearCloseTimer = () => {
    if (closeTimerRef.current !== null) {
      window.clearTimeout(closeTimerRef.current);
      closeTimerRef.current = null;
    }
  };

  const closeFloatingMenu = () => {
    clearCloseTimer();
    setOpenDropdown(null);
    setFloatingMenuPosition(null);
  };

  const closeHoverLabel = () => {
    clearCloseTimer();
    setHoverLabel(null);
    setHoverLabelPosition(null);
  };

  const scheduleCloseFloatingMenu = () => {
    clearCloseTimer();
    closeTimerRef.current = window.setTimeout(() => {
      closeFloatingMenu();
    }, 140);
  };

  const scheduleCloseHoverLabel = () => {
    clearCloseTimer();
    closeTimerRef.current = window.setTimeout(() => {
      closeHoverLabel();
    }, 120);
  };

  const openFloatingMenuForItem = (
    idx: number,
    event: React.MouseEvent<HTMLButtonElement>,
  ) => {
    clearCloseTimer();
    closeHoverLabel();
    setOpenDropdown(idx);

    const rect = event.currentTarget.getBoundingClientRect();
    setFloatingMenuPosition({
      top: rect.top,
      left: rect.right + 12,
    });
  };

  const openHoverLabelForItem = (
    label: string,
    event: React.MouseEvent<HTMLElement>,
  ) => {
    clearCloseTimer();
    setHoverLabel(label);

    const rect = event.currentTarget.getBoundingClientRect();
    setHoverLabelPosition({
      top: rect.top + rect.height / 2,
      left: rect.right + 12,
    });
  };

  const handleDropdownClick = (
    idx: number,
    event?: React.MouseEvent<HTMLButtonElement>,
  ) => {
    if (openDropdown === idx) {
      closeFloatingMenu();
      return;
    }

    closeHoverLabel();
    setOpenDropdown(idx);

    if (!sidebarOpen && event) {
      const rect = event.currentTarget.getBoundingClientRect();
      setFloatingMenuPosition({
        top: rect.top,
        left: rect.right + 12,
      });
    }
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

  useEffect(() => {
    if (sidebarOpen) {
      setFloatingMenuPosition(null);
      closeHoverLabel();
      return;
    }

    if (openDropdown !== null) {
      const button = itemButtonRefs.current[openDropdown];
      if (button) {
        const rect = button.getBoundingClientRect();
        setFloatingMenuPosition({
          top: rect.top,
          left: rect.right + 12,
        });
      }
    }

    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node;
      if (sidebarRef.current?.contains(target)) return;
      if (floatingMenuRef.current?.contains(target)) return;
      if (floatingLabelRef.current?.contains(target)) return;
      closeFloatingMenu();
      closeHoverLabel();
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [sidebarOpen]);

  useEffect(() => {
    if (sidebarOpen) return;

    const handleScroll = () => {
      if (openDropdown === null) return;
      const button = itemButtonRefs.current[openDropdown];
      if (!button) return;

      const rect = button.getBoundingClientRect();
      setFloatingMenuPosition({
        top: rect.top,
        left: rect.right + 12,
      });
    };

    window.addEventListener("scroll", handleScroll, true);
    window.addEventListener("resize", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll, true);
      window.removeEventListener("resize", handleScroll);
    };
  }, [openDropdown, sidebarOpen]);

  useEffect(() => {
    return () => clearCloseTimer();
  }, []);

  useEffect(() => {
    if (sidebarOpen || hoverLabel === null) return;

    const handleScroll = () => {
      if (hoverLabel === null) return;
      const button = itemButtonRefs.current.find((item) => item?.dataset.label === hoverLabel);
      if (!button) return;

      const rect = button.getBoundingClientRect();
      setHoverLabelPosition({
        top: rect.top + rect.height / 2,
        left: rect.right + 12,
      });
    };

    window.addEventListener("scroll", handleScroll, true);
    window.addEventListener("resize", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll, true);
      window.removeEventListener("resize", handleScroll);
    };
  }, [hoverLabel, sidebarOpen]);

  return (
    <aside
      ref={sidebarRef}
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
                        ? "bg-[var(--sidebar-primary)] text-[var(--sidebar-primary-foreground)]"
                        : "text-[var(--sidebar-foreground)] hover:bg-[var(--sidebar-accent)] hover:text-[var(--sidebar-accent-foreground)]";

                      return (
                        <button
                          ref={(element) => {
                            itemButtonRefs.current[idx] = element;
                          }}
                          data-label={item.label}
                          onClick={
                            sidebarOpen
                              ? (event) => handleDropdownClick(idx, event)
                              : undefined
                          }
                          onMouseEnter={
                            sidebarOpen
                              ? undefined
                              : (event) => openFloatingMenuForItem(idx, event)
                          }
                          onMouseLeave={sidebarOpen ? undefined : scheduleCloseFloatingMenu}
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
                                ? "bg-[var(--sidebar-primary)] text-[var(--sidebar-primary-foreground)] font-medium"
                                : "text-[var(--sidebar-foreground)] hover:bg-[var(--sidebar-accent)] hover:text-[var(--sidebar-accent-foreground)]"
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
                    {!sidebarOpen && openDropdown === idx && floatingMenuPosition && typeof document !== "undefined" &&
                      createPortal(
                        <div
                          ref={floatingMenuRef}
                          className="fixed z-50 min-w-56 rounded-xl border border-sidebar-border bg-[var(--sidebar)]/80 p-2 shadow-[0_20px_40px_-20px_rgba(8,12,34,0.45)] backdrop-blur-md"
                          onMouseEnter={clearCloseTimer}
                          onMouseLeave={scheduleCloseFloatingMenu}
                          style={{
                            top: floatingMenuPosition.top,
                            left: floatingMenuPosition.left,
                          }}
                        >
                          <div className="mb-2 px-2 text-xs font-semibold uppercase tracking-wider text-[var(--sidebar-foreground)]/70">
                            {item.label}
                          </div>
                          <div className="space-y-1">
                            {item.children.map((child, ci) => (
                              <Link
                                key={ci}
                                href={child.href}
                                onClick={closeFloatingMenu}
                                className={`flex items-center gap-3 rounded-lg px-3 py-2 transition-colors ${
                                  pathname === child.href
                                    ? "bg-[var(--sidebar-primary)] text-[var(--sidebar-primary-foreground)] font-medium"
                                    : "text-[var(--sidebar-foreground)] hover:bg-[var(--sidebar-accent)] hover:text-[var(--sidebar-accent-foreground)]"
                                }`}
                              >
                                <DotIcon className="h-4 w-4 shrink-0" />
                                <span className="text-sm">{child.label}</span>
                              </Link>
                            ))}
                          </div>
                        </div>,
                        document.body,
                      )}
                  </div>
                ) : (
                  <Link
                    href={item.href!}
                    data-label={item.label}
                    onMouseEnter={
                      sidebarOpen
                        ? undefined
                        : (event) => openHoverLabelForItem(item.label, event)
                    }
                    onMouseLeave={sidebarOpen ? undefined : scheduleCloseHoverLabel}
                    className={`flex items-center rounded group transition-colors ${
                      pathname === item.href
                        ? "bg-[var(--sidebar-primary)] text-[var(--sidebar-primary-foreground)] font-medium"
                        : "text-[var(--sidebar-foreground)] hover:bg-[var(--sidebar-accent)] hover:text-[var(--sidebar-accent-foreground)]"
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

      {!sidebarOpen &&
        hoverLabel &&
        hoverLabelPosition &&
        typeof document !== "undefined" &&
        createPortal(
          <div
            ref={floatingLabelRef}
            className="fixed z-50 -translate-y-1/2 rounded-lg border border-sidebar-border bg-[var(--sidebar)]/85 px-3 py-2 text-sm font-medium text-[var(--sidebar-foreground)] shadow-[0_16px_32px_-18px_rgba(8,12,34,0.5)] backdrop-blur-md"
            onMouseEnter={clearCloseTimer}
            onMouseLeave={scheduleCloseHoverLabel}
            style={{
              top: hoverLabelPosition.top,
              left: hoverLabelPosition.left,
            }}
          >
            {hoverLabel}
          </div>,
          document.body,
        )}
    </aside>
  );
}
