import { LayoutDashboard, Settings } from "lucide-react";
import type { SidebarLink } from "@/types/sidebar";

export const sidebarLinks: SidebarLink[] = [
  {
    label: "Dashboard",
    icon: LayoutDashboard,
    children: [
      { label: "Overview", href: "/dashboard" },
      { label: "Analytics", href: "/dashboard/analytics" },
    ],
  },
  {
    label: "Settings",
    icon: Settings,
    children: [
      { label: "Role", href: "/dashboard/settings/role" },
      { label: "Admin", href: "/dashboard/settings/admin" },
    ],
  },
];
