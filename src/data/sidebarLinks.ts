import {
  LayoutDashboard,
  ShoppingCart,
  GraduationCap,
  Truck,
  Mail,
  MessageCircle,
  Calendar,
} from "lucide-react";
import type { SidebarLink } from "@/types/sidebar";

export const sidebarLinks: SidebarLink[] = [
  {
    label: "Dashboards",
    icon: LayoutDashboard,
    badge: 5,
    children: [
      { label: "CRM", href: "/dashboard/crm" },
      { label: "Analytics", href: "/dashboard/analytics" },
    ],
  },
  { label: "eCommerce", icon: ShoppingCart, href: "/dashboard/ecommerce" },
  { label: "Academy", icon: GraduationCap, href: "/dashboard/academy" },
  { label: "Logistics", icon: Truck, href: "/dashboard/logistics" },
  { label: "Email", icon: Mail, href: "/dashboard/email" },
  { label: "Chat", icon: MessageCircle, href: "/dashboard/chat" },
  { label: "Calendar", icon: Calendar, href: "/dashboard/calendar" },
  { label: "eCommerce", icon: ShoppingCart, href: "/dashboard/ecommerce" },
  { label: "Academy", icon: GraduationCap, href: "/dashboard/academy" },
  { label: "Logistics", icon: Truck, href: "/dashboard/logistics" },
  { label: "Email", icon: Mail, href: "/dashboard/email" },
  { label: "Chat", icon: MessageCircle, href: "/dashboard/chat" },
  { label: "Calendar", icon: Calendar, href: "/dashboard/calendar" },
  { label: "eCommerce", icon: ShoppingCart, href: "/dashboard/ecommerce" },
  { label: "Academy", icon: GraduationCap, href: "/dashboard/academy" },
  { label: "Logistics", icon: Truck, href: "/dashboard/logistics" },
  { label: "Email", icon: Mail, href: "/dashboard/email" },
  { label: "Chat", icon: MessageCircle, href: "/dashboard/chat" },
  { label: "Calendar", icon: Calendar, href: "/dashboard/calendar" },
];
