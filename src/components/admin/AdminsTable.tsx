"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { AdminItem } from "@/types/admin";
import { formatDate } from "@/lib/formatDate";
import { AdminsPagination } from "@/types/admin";
import { cn } from "@/lib/utils";

interface AdminsTableProps {
  admins: AdminItem[];
  adminsLoading: boolean;
  pagination?: AdminsPagination;
  page: number;
  pageSize: number;
  deletingId: string | null;
  onEdit: (adminId: string) => void;
  onDelete: (admin: AdminItem) => void;
  onPageSizeChange: (value: number) => void;
  onPageChange: (nextPage: number) => void;
}

const getRoleName = (role: AdminItem["role"]): string => {
  if (!role) return "-";
  if (typeof role === "string") return role;
  return role.name;
};

const buildPaginationItems = (
  currentPage: number,
  totalPages: number,
): Array<number | "ellipsis"> => {
  if (totalPages <= 7) {
    return Array.from({ length: totalPages }, (_, index) => index + 1);
  }

  const items: Array<number | "ellipsis"> = [1];
  const start = Math.max(2, currentPage - 1);
  const end = Math.min(totalPages - 1, currentPage + 1);

  if (start > 2) {
    items.push("ellipsis");
  }

  for (let pageNumber = start; pageNumber <= end; pageNumber += 1) {
    items.push(pageNumber);
  }

  if (end < totalPages - 1) {
    items.push("ellipsis");
  }

  items.push(totalPages);
  return items;
};

export function AdminsTable({
  admins,
  adminsLoading,
  pagination,
  page,
  pageSize,
  deletingId,
  onEdit,
  onDelete,
  onPageSizeChange,
  onPageChange,
}: AdminsTableProps) {
  const currentLimit = pagination?.limit || pageSize;
  const totalPages = Math.max(
    1,
    Math.ceil((pagination?.totalCount || 0) / currentLimit),
  );
  const pageItems = buildPaginationItems(page, totalPages);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Admins ({admins.length})</CardTitle>
      </CardHeader>
      <CardContent>
        {adminsLoading ? (
          <div className="text-sm text-muted-foreground">Loading admins...</div>
        ) : admins.length === 0 ? (
          <div className="text-sm text-muted-foreground">No admins found</div>
        ) : (
          <div className="space-y-3">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Created At</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {admins.map((admin) => (
                  <TableRow key={admin._id}>
                    <TableCell>{admin.username || admin.name || "-"}</TableCell>
                    <TableCell>{admin.email || "-"}</TableCell>
                    <TableCell>{getRoleName(admin.role)}</TableCell>
                    <TableCell className="capitalize">
                      {admin.status || "-"}
                    </TableCell>
                    <TableCell>
                      {admin.createdAt ? formatDate(admin.createdAt) : "-"}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => onEdit(admin._id)}
                        >
                          Edit
                        </Button>
                        <Button
                          variant="destructive"
                          size="sm"
                          className="bg-red-600 text-white hover:bg-red-700 dark:bg-red-500 dark:hover:bg-red-400"
                          disabled={deletingId === admin._id}
                          onClick={() => onDelete(admin)}
                        >
                          {deletingId === admin._id ? "Deleting..." : "Delete"}
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>

            <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
              <p className="text-xs text-muted-foreground">
                Showing page {page} of {totalPages} (
                {pagination?.totalCount || admins.length} total)
              </p>
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-2">
                  <label
                    htmlFor="admin-page-size"
                    className="text-xs text-muted-foreground"
                  >
                    Page size
                  </label>
                  <Select
                    value={String(currentLimit)}
                    onValueChange={(value) => onPageSizeChange(Number(value))}
                  >
                    <SelectTrigger
                      id="admin-page-size"
                      className="h-7 w-20 text-xs"
                    >
                      <SelectValue placeholder="10" />
                    </SelectTrigger>
                    <SelectContent className="bg-[var(--background)]">
                      <SelectItem value="2">2</SelectItem>
                      <SelectItem value="5">5</SelectItem>
                      <SelectItem value="10">10</SelectItem>
                      <SelectItem value="20">20</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex flex-wrap items-center gap-1">
                  {pageItems.map((item, index) => {
                    if (item === "ellipsis") {
                      return (
                        <span
                          key={`ellipsis-${index}`}
                          className="px-1 text-xs text-muted-foreground"
                        >
                          ...
                        </span>
                      );
                    }

                    return (
                      <Button
                        key={item}
                        type="button"
                        size="sm"
                        variant={item === page ? "default" : "outline"}
                        onClick={() => onPageChange(item)}
                        className={cn("h-7 min-w-7 px-2 text-xs", {
                          "font-extrabold": item === page,
                        })}
                      >
                        {item}
                      </Button>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
