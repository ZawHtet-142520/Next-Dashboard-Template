"use client";

import { Button } from "@/components/ui/button";

interface RoleHeaderProps {
  rolesLoading: boolean;
  onOpenCreate: () => void;
  onRefresh: () => void;
}

export function RoleHeader({
  rolesLoading,
  onOpenCreate,
  onRefresh,
}: RoleHeaderProps) {
  return (
    <div className="flex items-center justify-between">
      <div>
        <h1 className="text-2xl font-semibold">Role Management</h1>
        <p className="text-sm text-muted-foreground">
          Create, view, and delete dashboard roles
        </p>
      </div>
      <div className="flex items-center gap-2">
        <Button onClick={onOpenCreate}>Create Role</Button>
        <Button onClick={onRefresh} disabled={rolesLoading} variant="outline">
          {rolesLoading ? "Refreshing..." : "Refresh"}
        </Button>
      </div>
    </div>
  );
}
