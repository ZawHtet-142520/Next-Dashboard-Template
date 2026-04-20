"use client";

import { Button } from "@/components/ui/button";
import { useModalPortal } from "@/hooks/useModalPortal";

interface DeleteRoleConfirmModalProps {
  open: boolean;
  roleName: string;
  isPending: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

export function DeleteRoleConfirmModal({
  open,
  roleName,
  isPending,
  onClose,
  onConfirm,
}: DeleteRoleConfirmModalProps) {
  const { isMounted, createPortal } = useModalPortal();

  if (!open || !isMounted) return null;

  const modalContent = (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900/35 backdrop-blur-[4px]  p-4">
      <div className="w-full max-w-md max-h-[90vh] overflow-y-auto rounded-lg border border-border bg-[var(--background)] p-6 text-[var(--foreground)] shadow-lg shadow-slate-900/5">
        <h2 className="text-lg font-semibold text-[var(--secondary-foreground)]">
          Delete Role
        </h2>
        <p className="mt-2 text-sm text-muted-foreground">
          Are you sure you want to delete{" "}
          <span className="font-medium text-[var(--foreground)]">
            {roleName}
          </span>
          ? This action cannot be undone.
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
            className="bg-red-600 text-white hover:bg-red-700 dark:bg-red-500 dark:hover:bg-red-400"
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
