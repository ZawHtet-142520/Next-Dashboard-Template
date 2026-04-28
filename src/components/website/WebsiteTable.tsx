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
import { WebsiteItem, WebsiteListPagination } from "@/types/website";
import Image from "next/image";
import toast from "react-hot-toast";

interface WebsiteTableProps {
  websites: WebsiteItem[];
  webstieListLoading: boolean;
  pagination?: WebsiteListPagination;
  page: number;
  pageSize: number;
  deletingId: string | null;
  onEdit: (website: WebsiteItem) => void;
  onDelete: (useWebsiteManagement: WebsiteItem) => void;
  onConfigure: (website: WebsiteItem) => void;
  onPageSizeChange: (value: number) => void;
  onPageChange: (nextPage: number) => void;
  toLogoPreviewUrl: (logo: string | undefined | null) => string;
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

export function WebsiteTable({
  websites,
  webstieListLoading,
  pagination,
  page,
  pageSize,
  deletingId,
  onEdit,
  onDelete,
  onConfigure,
  onPageSizeChange,
  onPageChange,
  toLogoPreviewUrl,
}: WebsiteTableProps) {
  const copyWebsiteId = async (websiteId: string) => {
    try {
      if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(websiteId);
        toast.success("Website ID copied");
        return;
      }

      const textArea = document.createElement("textarea");
      textArea.value = websiteId;
      textArea.style.position = "fixed";
      textArea.style.opacity = "0";
      document.body.appendChild(textArea);
      textArea.focus();
      textArea.select();
      const copied = document.execCommand("copy");
      document.body.removeChild(textArea);

      if (copied) {
        toast.success("Website ID copied");
      } else {
        toast.error("Failed to copy Website ID");
      }
    } catch {
      toast.error("Failed to copy Website ID");
    }
  };

  const currentLimit = pagination?.limit || pageSize;
  const totalPages = Math.max(
    1,
    Math.ceil((pagination?.totalCount || 0) / currentLimit),
  );
  const pageItems = buildPaginationItems(page, totalPages);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Websites ({websites.length})</CardTitle>
      </CardHeader>
      <CardContent>
        {webstieListLoading ? (
          <div className="text-sm text-muted-foreground">
            Loading websites...
          </div>
        ) : websites.length === 0 ? (
          <div className="text-sm text-muted-foreground">No websites found</div>
        ) : (
          <div className="space-y-3">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Phone</TableHead>
                  <TableHead>Domain</TableHead>
                  <TableHead>Subject</TableHead>
                  <TableHead>Organization</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {websites.map((website) => (
                  <TableRow key={website._id}>
                    <TableCell>
                      <div className="flex items-center justify-start gap-3">
                        <div className="w-10 h-10 flex overflow-hidden items-center justify-center border rounded-full">
                          {toLogoPreviewUrl(website.logo) ? (
                            <div className="w-full h-full">
                              <Image
                                src={toLogoPreviewUrl(website.logo)}
                                width={50}
                                height={50}
                                alt="Logo"
                                className="w-full h-full object-cover"
                                onError={(e) => {
                                  e.currentTarget.classList.add("hidden");
                                  e.currentTarget.nextElementSibling?.classList.remove(
                                    "hidden",
                                  );
                                  e.currentTarget.nextElementSibling?.classList.add(
                                    "flex",
                                  );
                                }}
                                onLoad={(e) => {
                                  e.currentTarget.classList.remove("hidden");
                                }}
                              />
                              <div className="hidden capitalize font-semibold text-xl">
                                {website.name.charAt(0)}
                              </div>
                            </div>
                          ) : (
                            <span className="capitalize font-semibold text-xl">
                              {website.name.charAt(0)}
                            </span>
                          )}
                        </div>
                        <span>{website.name}</span>
                      </div>
                    </TableCell>
                    <TableCell>{website.email || "-"}</TableCell>
                    <TableCell>{website.phone || "-"}</TableCell>
                    <TableCell>{website.url || "-"}</TableCell>
                    <TableCell className="max-w-[220px]">
                      <span
                        className="block truncate"
                        title={website.subject || "-"}
                      >
                        {website.subject || "-"}
                      </span>
                    </TableCell>
                    <TableCell>{website.organization || "-"}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => onConfigure(website)}
                        >
                          Configure
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => copyWebsiteId(website._id)}
                        >
                          Copy ID
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => onEdit(website)}
                        >
                          Edit
                        </Button>
                        <Button
                          variant="destructive"
                          size="sm"
                          disabled={deletingId === website._id}
                          onClick={() => onDelete(website)}
                          className="bg-red-600 text-white hover:bg-red-700 dark:bg-red-500 dark:hover:bg-red-400"
                        >
                          {deletingId === website._id
                            ? "Deleting..."
                            : "Delete"}
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
                {pagination?.totalCount || websites.length} total)
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
