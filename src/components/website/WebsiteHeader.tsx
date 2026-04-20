"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { formatDate } from "@/lib/formatDate";
import { ChevronDownIcon } from "lucide-react";
import { Calendar } from "../ui/calendar";
import { useState } from "react";

interface WebsiteHeaderProps {
  onOpenCreate: () => void;
  onClearFilters: () => void;
  search: string;
  onSearchChange: (value: string) => void;
  createdAfter: string;
  createdBefore: string;
  onCreatedAfterChange: (value: string) => void;
  onCreatedBeforeChange: (value: string) => void;
}

export function WebsiteHeader({
  onOpenCreate,
  onClearFilters,
  search,
  onSearchChange,
  createdAfter,
  createdBefore,
  onCreatedAfterChange,
  onCreatedBeforeChange,
}: WebsiteHeaderProps) {
  const [openDateAfter, setOpenDateAfter] = useState<boolean>(false);
  const [openDateBefore, setOpenDateBefore] = useState<boolean>(false);

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Website Management</h1>
        </div>
        <div className="flex items-center gap-2">
          <Button onClick={onOpenCreate}>Create Website</Button>
          <Button onClick={onClearFilters} variant="outline">
            Clear Filters
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-2 md:grid-cols-5">
        <Input
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Search by name, email and organization"
          className="col-span-3"
        />

        <Popover open={openDateAfter} onOpenChange={setOpenDateAfter}>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              id="date-picker-optional"
              className="w-full justify-between font-normal"
            >
              {createdAfter ? formatDate(createdAfter) : "Select Created After"}
              <ChevronDownIcon />
            </Button>
          </PopoverTrigger>
          <PopoverContent
            className="w-auto overflow-hidden p-0 bg-[var(--background)]"
            align="center"
          >
            <Calendar
              mode="single"
              captionLayout="dropdown"
              onSelect={(date) => {
                onCreatedAfterChange(date?.toLocaleDateString("sv") || "");
                setOpenDateAfter(false);
              }}
            />
          </PopoverContent>
        </Popover>

        <Popover open={openDateBefore} onOpenChange={setOpenDateBefore}>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              id="date-picker-optional"
              className="w-full justify-between font-normal"
            >
              {createdBefore
                ? formatDate(createdBefore)
                : "Select Created Before"}
              <ChevronDownIcon />
            </Button>
          </PopoverTrigger>
          <PopoverContent
            className="w-auto overflow-hidden p-0 bg-[var(--background)]"
            align="center"
          >
            <Calendar
              mode="single"
              captionLayout="dropdown"
              onSelect={(date) => {
                onCreatedBeforeChange(date?.toLocaleDateString("sv") || "");
                setOpenDateBefore(false);
              }}
            />
          </PopoverContent>
        </Popover>
      </div>
    </div>
  );
}
