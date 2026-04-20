"use client";

import { Button } from "@/components/ui/button";
import { useModalPortal } from "@/hooks/useModalPortal";

interface DeleteLogConfirmModalProps {
  open: boolean;
  isPending: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

export function DeleteAllLogsConfirmModal({
  open,
  isPending,
  onClose,
  onConfirm,
}: DeleteLogConfirmModalProps) {
  const { isMounted, createPortal } = useModalPortal();

  if (!open || !isMounted) return null;

  const modalContent = (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900/35 backdrop-blur-[4px]  p-4">
      <div className="w-full max-w-md max-h-[90vh] overflow-y-auto rounded-lg border border-slate-200 bg-[var(--background)] p-6 shadow-lg dark:border-slate-700">
        <h2 className="text-lg font-semibold text-[var(--secondary-foreground)]">
          Delete All Logs
        </h2>
        <p className="mt-2 text-sm text-[var(--foreground)]">
          Are you sure you want to delete all logs? This action cannot be
          undone.
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

  return createPortal(modalContent);
}
