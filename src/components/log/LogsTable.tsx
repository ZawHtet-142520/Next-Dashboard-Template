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
import { LogItem, LogsPagination, LogType } from "@/types/log";
import { format } from "date-fns";

interface LogsTableProps {
  logs: LogItem[];
  logsLoading: boolean;
  pagination?: LogsPagination;
  page: number;
  pageSize: number;
  deletingId: string | null;
  type: LogType;
  onDelete: (log: LogItem) => void;
  onPageSizeChange: (value: number) => void;
  onPageChange: (nextPage: number) => void;
}

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

export function LogsTable({
  logs,
  logsLoading,
  pagination,
  page,
  pageSize,
  deletingId,
  type,
  onDelete,
  onPageSizeChange,
  onPageChange,
}: LogsTableProps) {
  const currentLimit = pagination?.limit || pageSize;
  const totalPages = Math.max(
    1,
    Math.ceil((pagination?.totalCount || 0) / currentLimit),
  );
  const pageItems = buildPaginationItems(page, totalPages);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Logs ({logs.length})</CardTitle>
      </CardHeader>
      <CardContent>
        {logsLoading ? (
          <div className="text-sm text-muted-foreground">Loading logs...</div>
        ) : logs.length === 0 ? (
          <div className="text-sm text-muted-foreground">No logs found</div>
        ) : (
          <div className="space-y-3">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Email</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Agent</TableHead>
                  <TableHead>IP Address</TableHead>
                  {type == "audit" && <TableHead>Resource</TableHead>}
                  <TableHead>Action</TableHead>
                  <TableHead>Platform</TableHead>
                  <TableHead>
                    {type == "user" ? "Login Time" : "Created Date"}
                  </TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {logs.map((log) => (
                  <TableRow key={log._id}>
                    <TableCell>{log?.admin?.email || "-"}</TableCell>
                    <TableCell>{log?.admin?.role?.name || "-"}</TableCell>
                    <TableCell>{log?.agent || "-"}</TableCell>
                    <TableCell>{log?.ip || "-"}</TableCell>
                    {type == "audit" && (
                      <TableCell>{log?.resource || "-"}</TableCell>
                    )}
                    <TableCell>
                      <span className="capitalize">{log?.action || "-"}</span>
                    </TableCell>
                    <TableCell>{log?.platform || "-"}</TableCell>
                    <TableCell>
                      {log.createdAt
                        ? format(log.createdAt, "dd MMM yyyy, hh:mm:ss a")
                        : "-"}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="destructive"
                          size="sm"
                          disabled={deletingId === log._id}
                          onClick={() => onDelete(log)}
                          className="bg-red-600 text-white hover:bg-red-700 dark:bg-red-500 dark:hover:bg-red-400"
                        >
                          {deletingId === log._id ? "Deleting..." : "Delete"}
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
                {pagination?.totalCount || logs.length} total)
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
                    <SelectContent>
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
                        className="h-7 min-w-7 px-2 text-xs"
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
