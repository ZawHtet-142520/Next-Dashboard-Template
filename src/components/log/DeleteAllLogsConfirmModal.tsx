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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/35 backdrop-blur-sm dark:bg-black/80 dark:backdrop-blur-md p-4">
      <div className="w-full max-w-md max-h-[90vh] overflow-y-auto rounded-lg border border-slate-200 bg-white p-6 text-slate-900 shadow-lg dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100">
        <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100">Delete All Logs</h2>
        <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">
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
          >
            {isPending ? "Deleting..." : "Delete"}
          </Button>
        </div>
      </div>
    </div>
  );

  return createPortal(modalContent);
}
