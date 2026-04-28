"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Role } from "@/types/role";

interface AdminHeaderProps {
  onOpenCreate: () => void;
  onClearFilters: () => void;
  search: string;
  statusFilter: string;
  roleFilter: string;
  roleOptions: Role[];
  onSearchChange: (value: string) => void;
  onStatusFilterChange: (value: string) => void;
  onRoleFilterChange: (value: string) => void;
}

export function AdminHeader({
  onOpenCreate,
  onClearFilters,
  search,
  statusFilter,
  roleFilter,
  roleOptions,
  onSearchChange,
  onStatusFilterChange,
  onRoleFilterChange,
}: AdminHeaderProps) {
  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Admin Management</h1>
        </div>
        <div className="flex items-center gap-2">
          <Button
            onClick={onOpenCreate}
            className="border bg-[var(--primary)] text-white border-transparent dark:border-primary/40"
          >
            Create Admin
          </Button>
          <Button onClick={onClearFilters} variant="outline">
            Clear Filters
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-2 md:grid-cols-3">
        <Input
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Search by email or username"
        />

        <Select
          value={statusFilter || "all"}
          onValueChange={(value) =>
            onStatusFilterChange(value === "all" ? "" : value)
          }
        >
          <SelectTrigger>
            <SelectValue placeholder="All status" />
          </SelectTrigger>
          <SelectContent className="bg-[var(--background)]">
            <SelectItem value="all">All status</SelectItem>
            <SelectItem value="active">Active</SelectItem>
            <SelectItem value="suspend">Suspend</SelectItem>
          </SelectContent>
        </Select>

        <Select
          value={roleFilter || "all"}
          onValueChange={(value) =>
            onRoleFilterChange(value === "all" ? "" : value)
          }
        >
          <SelectTrigger>
            <SelectValue placeholder="All roles" />
          </SelectTrigger>
          <SelectContent className="bg-[var(--background)]">
            <SelectItem value="all">All roles</SelectItem>
            {roleOptions.map((role) => (
              <SelectItem key={role._id} value={role._id}>
                {role.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}
