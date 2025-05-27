"use client";

import { useAuthGuard } from "@/hooks/useAuthGuard";

export default function DashboardAuthWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  useAuthGuard();

  return <>{children}</>;
}
