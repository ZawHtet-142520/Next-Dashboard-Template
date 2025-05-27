import { LucideIcon } from "lucide-react";

export interface SidebarChild {
  label: string;
  href: string;
}

export interface SidebarLink {
  label: string;
  icon: LucideIcon;
  href?: string;
  badge?: number;
  children?: SidebarChild[];
}
