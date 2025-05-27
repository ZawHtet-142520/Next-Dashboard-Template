"use client";

import { ReactNode, useState } from "react";
import { useDashboardStore } from "@/stores/useDashboardStore";
import { usePathname } from "next/navigation";
import Link from "next/link";
import TopNavbar from "@/components/layouts/TopNavbar";
import {
  LayoutDashboard,
  ShoppingCart,
  GraduationCap,
  Truck,
  Mail,
  MessageCircle,
  Calendar,
  ChevronDown,
  ChevronRight,
} from "lucide-react";

const sidebarLinks = [
  {
    label: "Dashboards",
    icon: LayoutDashboard,
    badge: 5,
    children: [
      { label: "CRM", href: "/dashboard/crm" },
      { label: "Analytics", href: "/dashboard/analytics" },
    ],
  },
  { label: "eCommerce", icon: ShoppingCart, href: "/ecommerce" },
  { label: "Academy", icon: GraduationCap, href: "/academy" },
  { label: "Logistics", icon: Truck, href: "/logistics" },
  { label: "Email", icon: Mail, href: "/email" },
  { label: "Chat", icon: MessageCircle, href: "/chat" },
  { label: "Calendar", icon: Calendar, href: "/calendar" },
  { label: "eCommerce", icon: ShoppingCart, href: "/ecommerce" },
  { label: "Academy", icon: GraduationCap, href: "/academy" },
  { label: "Logistics", icon: Truck, href: "/logistics" },
  { label: "Email", icon: Mail, href: "/email" },
  { label: "Chat", icon: MessageCircle, href: "/chat" },
  { label: "Calendar", icon: Calendar, href: "/calendar" },
  { label: "eCommerce", icon: ShoppingCart, href: "/ecommerce" },
  { label: "Academy", icon: GraduationCap, href: "/academy" },
  { label: "Logistics", icon: Truck, href: "/logistics" },
  { label: "Email", icon: Mail, href: "/email" },
  { label: "Chat", icon: MessageCircle, href: "/chat" },
  { label: "Calendar", icon: Calendar, href: "/calendar" },
];

export default function DashboardLayout({ children }: { children: ReactNode }) {
  const { sidebarOpen } = useDashboardStore();
  const pathname = usePathname();
  const [openDropdown, setOpenDropdown] = useState<number | null>(null);

  const handleDropdownClick = (idx: number) => {
    setOpenDropdown(openDropdown === idx ? null : idx);
  };

  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <aside
        className={`bg-white shadow border-r transition-all duration-300 ease-in-out
    ${sidebarOpen ? "w-[250px]" : "w-[80px]"}
    flex flex-col h-screen`}
      >
        {/* Sticky Header */}
        <div className="flex items-center justify-center h-16 sticky top-0 bg-white z-10">
          {sidebarOpen ? (
            <h2 className="text-2xl font-bold">MVS Dashboard</h2>
          ) : (
            <span className="text-2xl">MVS</span>
          )}
        </div>

        {/* Scrollable Nav */}
        <nav className="flex-1 overflow-y-auto px-4 pt-4 space-y-2">
          {sidebarLinks.map((item, idx) => (
            <div key={idx}>
              {item.children ? (
                <div className="space-y-2">
                  <button
                    onClick={() => handleDropdownClick(idx)}
                    className="flex items-center justify-between w-full text-gray-700 font-semibold px-2 py-1 rounded hover:bg-purple-200"
                  >
                    <div className="flex items-center gap-3">
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
                  {sidebarOpen && openDropdown === idx && (
                    <div className="ml-2 space-y-1 animate-slide-down">
                      {item.children.map((child, ci) => (
                        <Link
                          key={ci}
                          href={child.href}
                          className={`block px-2 py-1 rounded hover:bg-purple-200 ${
                            pathname === child.href
                              ? "bg-[#9087F3] font-medium"
                              : ""
                          }`}
                        >
                          <span className="flex items-center gap-2">
                            <span className="w-2 h-2 rounded-full bg-black" />
                            {child.label}
                          </span>
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              ) : (
                <Link
                  href={item.href!}
                  className={`flex items-center gap-3 px-2 py-2 rounded hover:bg-purple-200 group ${
                    pathname === item.href ? "bg-[#9087F3] font-medium" : ""
                  }`}
                >
                  <item.icon className="w-5 h-5 text-gray-700" />
                  {sidebarOpen ? (
                    <span>{item.label}</span>
                  ) : (
                    <span className="sr-only group-hover:not-sr-only absolute left-[90px] bg-black text-white text-xs px-2 py-1 rounded shadow">
                      {item.label}
                    </span>
                  )}
                </Link>
              )}
            </div>
          ))}
        </nav>
      </aside>

      {/* Main content */}
      <div className="flex-1 flex flex-col relative overflow-y-auto">
        {/* Top Navbar fixed */}
        <div className="sticky top-0 z-20 backdrop-blur bg-gray-100 px-4 pt-4">
          <TopNavbar />
        </div>

        {/* Scrollable content area */}
        <div className="flex-1 p-4 bg-gray-100">
          <main className="bg-white border rounded-lg shadow p-4">
            {children}
          </main>
        </div>
      </div>
    </div>
  );
}
