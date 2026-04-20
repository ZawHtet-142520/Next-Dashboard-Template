"use client";

import { Button } from "@/components/ui/button";

interface DeleteWebsiteConfirmModalProps {
  open: boolean;
  isPending: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

export function DeleteWebsiteConfirmModal({
  open,
  isPending,
  onClose,
  onConfirm,
}: DeleteWebsiteConfirmModalProps) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900/35 backdrop-blur-[4px]  p-4">
      <div className="w-full max-w-md rounded-lg border bg-[var(--background)] p-6 shadow-lg">
        <h2 className="text-lg font-semibold">Delete Website</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          <span>Are you sure you want to delete this </span>
          <span className="font-medium text-foreground">website</span>? This
          action cannot be undone.
        </p>

        <div className="mt-6 flex items-center justify-end gap-2">
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
            disabled={isPending}
          >
            Cancel
          </Button>
          <Button
            type="button"
            variant="destructive"
            onClick={onConfirm}
            disabled={isPending}
            className="bg-red-600 text-white hover:bg-red-700 dark:bg-red-500 dark:hover:bg-red-400"
          >
            {isPending ? "Deleting..." : "Delete"}
          </Button>
        </div>
      </div>
    </div>
  );
}
