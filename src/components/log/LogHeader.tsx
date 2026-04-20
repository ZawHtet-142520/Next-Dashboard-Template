import { Role } from "@/types/role";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { ChevronDownIcon } from "lucide-react";
import { Calendar } from "../ui/calendar";
import { useState } from "react";
import { formatDate } from "@/lib/formatDate";

interface LogHeaderProps {
  search: string;
  roleFilter: string;
  roleOptions: Role[];
  onClearFilters: () => void;
  onSearchChange: (value: string) => void;
  onRoleFilterChange: (value: string) => void;
  createdAfter: string;
  createdBefore: string;
  onCreatedAfterChange: (value: string) => void;
  onCreatedBeforeChange: (value: string) => void;
  onDelete: () => void;
  title: string;
}

export function LogHeader({
  onClearFilters,
  search,
  roleFilter,
  roleOptions,
  onSearchChange,
  onRoleFilterChange,
  createdAfter,
  createdBefore,
  onCreatedAfterChange,
  onCreatedBeforeChange,
  onDelete,
  title,
}: LogHeaderProps) {
  const [openDateAfter, setOpenDateAfter] = useState<boolean>(false);
  const [openDateBefore, setOpenDateBefore] = useState<boolean>(false);

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">{title}</h1>
        </div>
        <div className="flex items-center gap-2">
          <Button
            onClick={onDelete}
            variant="destructive"
            className="bg-red-600 text-white hover:bg-red-700 dark:bg-red-500 dark:hover:bg-red-400"
          >
            Delete All Logs
          </Button>
          <Button onClick={onClearFilters} variant="outline">
            Clear Filters
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-2 md:grid-cols-4">
        <Input
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Search by email"
        />

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
