"use client";

import { useRef } from "react";
import { ImagePlus, Trash2 } from "lucide-react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Role } from "@/types/role";

interface EditAdminModalProps {
  open: boolean;
  name: string;
  email: string;
  profilePreview: string;
  password: string;
  roleId: string;
  roleOptions: Role[];
  isPending: boolean;
  onNameChange: (value: string) => void;
  onEmailChange: (value: string) => void;
  onProfileFileChange: (file: File | null) => void;
  onPasswordChange: (value: string) => void;
  onRoleIdChange: (value: string) => void;
  onClose: () => void;
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
}

export function EditAdminModal({
  open,
  name,
  email,
  profilePreview,
  password,
  roleId,
  roleOptions,
  isPending,
  onNameChange,
  onEmailChange,
  onProfileFileChange,
  onPasswordChange,
  onRoleIdChange,
  onClose,
  onSubmit,
}: EditAdminModalProps) {
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="w-full max-w-lg rounded-lg border bg-background p-6 shadow-lg">
        <div className="mb-4">
          <h2 className="text-lg font-semibold">Edit Admin</h2>
          <p className="text-sm text-muted-foreground">
            Update admin account details
          </p>
        </div>

        <form onSubmit={onSubmit} className="space-y-3">
          <div className="rounded-xl border bg-slate-50/60 p-4">
            <p className="mb-3 text-sm font-medium">Profile</p>
            <div className="flex items-center gap-4">
              <div className="relative h-20 w-20 overflow-hidden rounded-full border bg-slate-200">
                {profilePreview ? (
                  <Image
                    src={profilePreview}
                    alt="Profile preview"
                    fill
                    sizes="80px"
                    className="object-cover"
                    unoptimized
                  />
                ) : (
                  <div className="grid h-full w-full place-items-center text-xl font-semibold text-slate-600">
                    {(name?.trim()?.charAt(0) || "A").toUpperCase()}
                  </div>
                )}
              </div>

              <div className="space-y-2">
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) =>
                    onProfileFileChange(e.target.files?.[0] || null)
                  }
                />
                <div className="flex items-center gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => fileInputRef.current?.click()}
                  >
                    <ImagePlus className="h-4 w-4" />
                    Pick Image
                  </Button>
                  <Button
                    type="button"
                    variant="ghost"
                    disabled={!profilePreview}
                    onClick={() => onProfileFileChange(null)}
                  >
                    <Trash2 className="h-4 w-4" />
                    Remove
                  </Button>
                </div>
                <p className="text-xs text-muted-foreground">
                  PNG, JPG, WEBP image files are supported.
                </p>
              </div>
            </div>
          </div>

          <div className="space-y-1.5">
            <label htmlFor="edit-admin-name" className="text-sm font-medium">
              Username
            </label>
            <Input
              id="edit-admin-name"
              value={name}
              onChange={(e) => onNameChange(e.target.value)}
              placeholder="Enter username"
              required
            />
          </div>

          <div className="space-y-1.5">
            <label htmlFor="edit-admin-email" className="text-sm font-medium">
              Email
            </label>
            <Input
              id="edit-admin-email"
              type="email"
              value={email}
              onChange={(e) => onEmailChange(e.target.value)}
              placeholder="Enter admin email"
              required
            />
          </div>

          <div className="space-y-1.5">
            <label
              htmlFor="edit-admin-password"
              className="text-sm font-medium"
            >
              Password (optional)
            </label>
            <Input
              id="edit-admin-password"
              type="password"
              value={password}
              onChange={(e) => onPasswordChange(e.target.value)}
              placeholder="Leave empty to keep current password"
            />
          </div>

          <div className="space-y-1.5">
            <label htmlFor="edit-admin-role" className="text-sm font-medium">
              Role
            </label>
            <select
              id="edit-admin-role"
              value={roleId}
              onChange={(e) => onRoleIdChange(e.target.value)}
              className="w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm"
              required
            >
              <option value="">Select role</option>
              {roleOptions.map((role) => (
                <option key={role._id} value={role._id}>
                  {role.name}
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-center justify-end gap-2 pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={isPending}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isPending}>
              {isPending ? "Updating..." : "Update"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
