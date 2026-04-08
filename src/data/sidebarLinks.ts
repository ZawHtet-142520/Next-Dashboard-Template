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
      { label: "Admin", href: "/dashboard/settings/admin" },
      { label: "Role", href: "/dashboard/settings/role" },
      { label: "User Logs", href: "/dashboard/settings/logs/user" },
      { label: "Audit Logs", href: "/dashboard/settings/logs/audit" },
      { label: "Email Setting", href: "/dashboard/settings/email" },
      {
        label: "Notification Template",
        href: "/dashboard/settings/notification",
      },
    ],
  },
];
