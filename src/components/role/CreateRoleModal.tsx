"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface CreateRoleModalProps {
  open: boolean;
  name: string;
  description: string;
  isPending: boolean;
  onNameChange: (value: string) => void;
  onDescriptionChange: (value: string) => void;
  onClose: () => void;
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
}

export function CreateRoleModal({
  open,
  name,
  description,
  isPending,
  onNameChange,
  onDescriptionChange,
  onClose,
  onSubmit,
}: CreateRoleModalProps) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="w-full max-w-lg rounded-lg border bg-background p-6 shadow-lg">
        <div className="mb-4">
          <h2 className="text-lg font-semibold">Create Role</h2>
          <p className="text-sm text-muted-foreground">
            Add a new role with name and description
          </p>
        </div>

        <form onSubmit={onSubmit} className="space-y-3">
          <div className="space-y-1.5">
            <label htmlFor="role-name" className="text-sm font-medium">
              Role Name
            </label>
            <Input
              id="role-name"
              value={name}
              onChange={(e) => onNameChange(e.target.value)}
              placeholder="Enter role name"
              required
            />
          </div>

          <div className="space-y-1.5">
            <label htmlFor="role-description" className="text-sm font-medium">
              Description
            </label>
            <textarea
              id="role-description"
              value={description}
              onChange={(e) => onDescriptionChange(e.target.value)}
              placeholder="Enter role description"
              rows={4}
              className="w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-xs outline-none transition-[color,box-shadow] placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]"
              required
            />
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
              {isPending ? "Creating..." : "Create"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
