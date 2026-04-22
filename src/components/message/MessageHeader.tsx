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
import { WebsiteNameItem } from "@/types/message";

interface MessageHeaderProps {
  onClearFilters: () => void;
  search: string;
  statusFilter: string;
  websiteFilter: string;
  websiteOptions: WebsiteNameItem[];
  onSearchChange: (value: string) => void;
  onStatusFilterChange: (value: string) => void;
  onWebsiteFilterChange: (value: string) => void;
}

export function MessageHeader({
  onClearFilters,
  search,
  statusFilter,
  websiteFilter,
  websiteOptions,
  onSearchChange,
  onStatusFilterChange,
  onWebsiteFilterChange,
}: MessageHeaderProps) {
  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Messages</h1>
        </div>
        <Button onClick={onClearFilters} variant="outline">
          Clear Filters
        </Button>
      </div>

      <div className="grid grid-cols-1 gap-2 md:grid-cols-3">
        <Input
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Search by name, email, subject, or body"
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
            <SelectItem value="pending">Pending</SelectItem>
            <SelectItem value="success">Success</SelectItem>
            <SelectItem value="failed">Failed</SelectItem>
          </SelectContent>
        </Select>

        <Select
          value={websiteFilter || "all"}
          onValueChange={(value) =>
            onWebsiteFilterChange(value === "all" ? "" : value)
          }
        >
          <SelectTrigger>
            <SelectValue placeholder="All websites" />
          </SelectTrigger>
          <SelectContent className="bg-[var(--background)]">
            <SelectItem value="all">All websites</SelectItem>
            {websiteOptions.map((website) => (
              <SelectItem key={website._id} value={website._id}>
                {website.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}
