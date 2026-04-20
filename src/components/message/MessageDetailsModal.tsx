"use client";

import { Button } from "@/components/ui/button";
import { useModalPortal } from "@/hooks/useModalPortal";
import { MessageItem } from "@/types/message";
import { format } from "date-fns";

interface MessageDetailsModalProps {
  open: boolean;
  isLoading: boolean;
  message: MessageItem | null;
  onClose: () => void;
}

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

export function MessageDetailsModal({
  open,
  isLoading,
  message,
  onClose,
}: MessageDetailsModalProps) {
  const { isMounted, createPortal } = useModalPortal();

  if (!open || !isMounted) return null;

  const modalContent = (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900/35 backdrop-blur-[4px]  p-4">
      <div className="w-full max-w-3xl max-h-[90vh] overflow-y-auto rounded-lg border border-slate-200 bg-[var(--background)] p-6 text-[var(--foreground)] shadow-lg">
        <div className="mb-4 flex items-start justify-between gap-3">
          <div>
            <h2 className="text-lg font-semibold text-[var(--foreground)]">
              Message Details
            </h2>
            <p className="text-sm text-[var(--foreground)]">
              View full contact message data
            </p>
          </div>
          <Button type="button" variant="outline" onClick={onClose}>
            Close
          </Button>
        </div>

        {isLoading ? (
          <div className="text-sm text-[var(--foreground)]">
            Loading message details...
          </div>
        ) : !message ? (
          <div className="text-sm text-[var(--foreground)]">
            Unable to load message details.
          </div>
        ) : (
          <div className="space-y-4">
            <div className="grid grid-cols-1 gap-3 rounded-lg border border-slate-200 p-3 md:grid-cols-2 dark:border-slate-700">
              <div>
                <p className="text-xs text-[var(--foreground)]">Website</p>
                <p className="font-medium text-[var(--secondary-foreground)]">
                  {message.website?.name || "-"}
                </p>
              </div>
              <div>
                <p className="text-xs text-[var(--foreground)]">
                  Website Email
                </p>
                <p className="font-medium text-[var(--secondary-foreground)]">
                  {message.website?.email || "-"}
                </p>
              </div>
              <div>
                <p className="text-xs text-[var(--foreground)]">Organization</p>
                <p className="font-medium text-[var(--secondary-foreground)]">
                  {message.website?.organization || "-"}
                </p>
              </div>
              <div>
                <p className="text-xs text-[var(--foreground)]">Status</p>
                <span
                  className={`inline-flex rounded-full px-2 py-0.5 text-xs font-medium capitalize ${getStatusClasses(message.status || "pending")}`}
                >
                  {message.status || "-"}
                </span>
              </div>
              <div>
                <p className="text-xs text-[var(--foreground)]">Created At</p>
                <p className="font-medium text-[var(--secondary-foreground)]">
                  {message.createdAt
                    ? format(message.createdAt, "dd MMM yyyy, hh:mm:ss a")
                    : "-"}
                </p>
              </div>
              <div>
                <p className="text-xs text-[var(--foreground)]">Updated At</p>
                <p className="font-medium text-[var(--secondary-foreground)]">
                  {message.updatedAt
                    ? format(message.updatedAt, "dd MMM yyyy, hh:mm:ss a")
                    : "-"}
                </p>
              </div>
            </div>

            <div className="rounded-lg border border-slate-200 p-3 dark:border-slate-700">
              <p className="mb-2 text-sm font-medium text-[var(--secondary-foreground)]">
                Payload
              </p>
              <div className="space-y-2">
                {Object.entries(message.payload || {}).map(([key, value]) => (
                  <div
                    key={key}
                    className="grid grid-cols-1 gap-1 md:grid-cols-5"
                  >
                    <p className="text-xs font-medium uppercase tracking-wide text-[var(--foreground)] md:col-span-2">
                      {key.replaceAll("_", " ")}
                    </p>
                    <p className="text-sm text-[var(--secondary-foreground)] md:col-span-3 break-words">
                      {value === null || value === undefined || value === ""
                        ? "-"
                        : String(value)}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );

  return createPortal(modalContent);
}
