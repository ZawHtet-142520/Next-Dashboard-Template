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
import { format } from "date-fns";
import { MessageItem, MessagesPagination } from "@/types/message";

interface MessagesTableProps {
  messages: MessageItem[];
  messagesLoading: boolean;
  pagination?: MessagesPagination;
  page: number;
  pageSize: number;
  onView: (message: MessageItem) => void;
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

const getSender = (message: MessageItem) => {
  return (
    message.payload.full_name ||
    message.payload.name ||
    message.payload.email ||
    "-"
  );
};

const getBody = (message: MessageItem) => {
  const body = message.payload.body;
  if (!body) return "-";

  if (body.length <= 80) return body;
  return `${body.slice(0, 77)}...`;
};

const getStatusClasses = (status: string) => {
  const normalized = status?.toLowerCase();

  if (normalized === "success") {
    return "bg-green-100 text-green-700 border border-green-200";
  }

  if (normalized === "failed") {
    return "bg-red-100 text-red-700 border border-red-200";
  }

  return "bg-amber-100 text-amber-700 border border-amber-200";
};

export function MessagesTable({
  messages,
  messagesLoading,
  pagination,
  page,
  pageSize,
  onView,
  onPageSizeChange,
  onPageChange,
}: MessagesTableProps) {
  const currentLimit = pagination?.limit || pageSize;
  const totalPages = Math.max(
    1,
    Math.ceil((pagination?.totalCount || 0) / currentLimit),
  );
  const pageItems = buildPaginationItems(page, totalPages);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Messages ({messages.length})</CardTitle>
      </CardHeader>
      <CardContent>
        {messagesLoading ? (
          <div className="text-sm text-muted-foreground">
            Loading messages...
          </div>
        ) : messages.length === 0 ? (
          <div className="text-sm text-muted-foreground">No messages found</div>
        ) : (
          <div className="space-y-3">
            <Table className="table-fixed min-w-[980px]">
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[140px]">Sender</TableHead>
                  <TableHead className="w-[140px]">Website</TableHead>
                  <TableHead className="w-[220px]">Subject</TableHead>
                  <TableHead className="w-[110px]">Status</TableHead>
                  <TableHead className="w-[320px]">Message</TableHead>
                  <TableHead className="w-[180px]">Created At</TableHead>
                  <TableHead className="w-[90px] text-right">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {messages.map((message) => (
                  <TableRow key={message._id}>
                    <TableCell>
                      <span
                        className="block truncate"
                        title={getSender(message)}
                      >
                        {getSender(message)}
                      </span>
                    </TableCell>
                    <TableCell>
                      <span
                        className="block truncate"
                        title={message.website?.name || "-"}
                      >
                        {message.website?.name || "-"}
                      </span>
                    </TableCell>
                    <TableCell>
                      <span
                        className="block truncate"
                        title={message.subject || "-"}
                      >
                        {message.subject || "-"}
                      </span>
                    </TableCell>
                    <TableCell>
                      <span
                        className={`inline-flex rounded-full px-2 py-0.5 text-xs font-medium capitalize ${getStatusClasses(message.status || "pending")}`}
                      >
                        {message.status || "-"}
                      </span>
                    </TableCell>
                    <TableCell>
                      <span
                        className="block truncate"
                        title={message.payload.body || "-"}
                      >
                        {getBody(message)}
                      </span>
                    </TableCell>
                    <TableCell>
                      <span className="block truncate">
                        {message.createdAt
                          ? format(message.createdAt, "dd MMM yyyy, hh:mm:ss a")
                          : "-"}
                      </span>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => onView(message)}
                      >
                        View
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>

            <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
              <p className="text-xs text-muted-foreground">
                Showing page {page} of {totalPages} (
                {pagination?.totalCount || messages.length} total)
              </p>
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-2">
                  <label
                    htmlFor="messages-page-size"
                    className="text-xs text-muted-foreground"
                  >
                    Page size
                  </label>
                  <Select
                    value={String(currentLimit)}
                    onValueChange={(value) => onPageSizeChange(Number(value))}
                  >
                    <SelectTrigger
                      id="messages-page-size"
                      className="h-7 w-20 text-xs"
                    >
                      <SelectValue placeholder="10" />
                    </SelectTrigger>
                    <SelectContent className="bg-[var(--background)]">
                      <SelectItem value="5">5</SelectItem>
                      <SelectItem value="10">10</SelectItem>
                      <SelectItem value="20">20</SelectItem>
                      <SelectItem value="50">50</SelectItem>
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
