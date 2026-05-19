"use client";

import { Eye, EyeOff } from "lucide-react";
import { useModalPortal } from "@/hooks/useModalPortal";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface ChangePasswordModalProps {
  open: boolean;
  oldPassword: string;
  newPassword: string;
  confirmNewPassword: string;
  isPending: boolean;
  onOldPasswordChange: (value: string) => void;
  onNewPasswordChange: (value: string) => void;
  onConfirmNewPasswordChange: (value: string) => void;
  onClose: () => void;
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
}

export function ChangePasswordModal({
  open,
  oldPassword,
  newPassword,
  confirmNewPassword,
  isPending,
  onOldPasswordChange,
  onNewPasswordChange,
  onConfirmNewPasswordChange,
  onClose,
  onSubmit,
}: ChangePasswordModalProps) {
  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const { isMounted, createPortal } = useModalPortal();

  if (!isMounted) return null;

  const modalContent = (
    <Dialog open={open} onOpenChange={(nextOpen) => !nextOpen && onClose()}>
      <DialogContent className="border-slate-200 bg-[var(--background)] text-[var(--foreground)] shadow-lg shadow-slate-900/10 dark:border-slate-700">
        <DialogHeader>
          <DialogTitle className="text-[var(--secondary-foreground)]">
            Change Password
          </DialogTitle>
          <DialogDescription className="text-[var(--foreground)]">
            Update your admin password
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={onSubmit} className="space-y-3">
          <div className="space-y-1.5">
            <label
              htmlFor="old-password"
              className="text-sm font-medium text-[var(--foreground)]"
            >
              Old Password
            </label>
            <div className="relative">
              <Input
                id="old-password"
                type={showOldPassword ? "text" : "password"}
                value={oldPassword}
                onChange={(e) => onOldPasswordChange(e.target.value)}
                placeholder="Enter current password"
                required
                className="pr-10 border-slate-300 bg-[var(--background)] text-[var(--foreground)] placeholder:text-slate-400 dark:border-slate-600 not-visited:dark:placeholder:text-slate-400"
              />
              <button
                type="button"
                onClick={() => setShowOldPassword((prev) => !prev)}
                className="absolute inset-y-0 right-0 flex items-center px-3 cursor-pointer text-[var(--foreground)]"
                aria-label={
                  showOldPassword ? "Hide old password" : "Show old password"
                }
              >
                {showOldPassword ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </button>
            </div>
          </div>

          <div className="space-y-1.5">
            <label
              htmlFor="new-password"
              className="text-sm font-medium text-[var(--foreground)]"
            >
              New Password
            </label>
            <div className="relative">
              <Input
                id="new-password"
                type={showNewPassword ? "text" : "password"}
                value={newPassword}
                onChange={(e) => onNewPasswordChange(e.target.value)}
                placeholder="Enter new password"
                required
                className="pr-10 border-slate-300 bg-[var(--background)] text-[var(--foreground)] placeholder:text-slate-400 dark:border-slate-600 dark:placeholder:text-slate-400"
              />
              <button
                type="button"
                onClick={() => setShowNewPassword((prev) => !prev)}
                className="absolute inset-y-0 right-0 flex items-center px-3 cursor-pointer text-[var(--foreground)]"
                aria-label={
                  showNewPassword ? "Hide new password" : "Show new password"
                }
              >
                {showNewPassword ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </button>
            </div>
          </div>

          <div className="space-y-1.5">
            <label
              htmlFor="confirm-new-password"
              className="text-sm font-medium text-[var(--foreground)]"
            >
              Confirm New Password
            </label>
            <div className="relative">
              <Input
                id="confirm-new-password"
                type={showConfirmPassword ? "text" : "password"}
                value={confirmNewPassword}
                onChange={(e) => onConfirmNewPasswordChange(e.target.value)}
                placeholder="Re-enter new password"
                required
                className="pr-10 border-slate-300 bg-[var(--background)] text-[var(--foreground)] placeholder:text-slate-400 dark:border-slate-600 dark:placeholder:text-slate-400"
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword((prev) => !prev)}
                className="absolute inset-y-0 right-0 flex items-center px-3 cursor-pointer text-[var(--foreground)]"
                aria-label={
                  showConfirmPassword
                    ? "Hide confirm password"
                    : "Show confirm password"
                }
              >
                {showConfirmPassword ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </button>
            </div>
          </div>

          <DialogFooter className="pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={isPending}
              className="border-slate-300 bg-white text-slate-800 hover:bg-slate-100 dark:border-slate-500 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isPending}
              className="border border-transparent bg-indigo-600 text-white hover:bg-indigo-700 dark:border-indigo-300/40 dark:bg-indigo-500 dark:hover:bg-indigo-400"
            >
              {isPending ? "Updating..." : "Update Password"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );

  return createPortal(modalContent);
}
