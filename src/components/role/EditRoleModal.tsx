"use client";

import { Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { PermissionName } from "@/types/role";

type PermissionGroupEntry = readonly [string, PermissionName[]];

interface EditRoleModalProps {
  open: boolean;
  editName: string;
  editDescription: string;
  selectedPermissionIds: string[];
  permissionSearch: string;
  filteredPermissionGroups: PermissionGroupEntry[];
  shownPermissionCount: number;
  permissionsLoading: boolean;
  hasPermissionGroups: boolean;
  isPending: boolean;
  onEditNameChange: (value: string) => void;
  onEditDescriptionChange: (value: string) => void;
  onPermissionSearchChange: (value: string) => void;
  onTogglePermission: (permissionId: string) => void;
  onToggleGroupPermissions: (
    permissions: PermissionName[],
    shouldSelect: boolean,
  ) => void;
  onSelectShownPermissions: () => void;
  onClearAllPermissions: () => void;
  onClose: () => void;
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  getPermissionHint: (permission: PermissionName) => string;
}

export function EditRoleModal({
  open,
  editName,
  editDescription,
  selectedPermissionIds,
  permissionSearch,
  filteredPermissionGroups,
  shownPermissionCount,
  permissionsLoading,
  hasPermissionGroups,
  isPending,
  onEditNameChange,
  onEditDescriptionChange,
  onPermissionSearchChange,
  onTogglePermission,
  onToggleGroupPermissions,
  onSelectShownPermissions,
  onClearAllPermissions,
  onClose,
  onSubmit,
  getPermissionHint,
}: EditRoleModalProps) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="w-full max-w-4xl rounded-lg border bg-background p-6 shadow-lg">
        <div className="mb-4">
          <h2 className="text-lg font-semibold">Edit Role</h2>
          <p className="text-sm text-muted-foreground">
            Update role details and permission mappings.
          </p>
        </div>

        <form onSubmit={onSubmit} className="space-y-3">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div className="space-y-1.5">
              <label
                htmlFor="edit-role-name"
                className="text-sm font-medium text-slate-700"
              >
                Name *
              </label>
              <Input
                id="edit-role-name"
                value={editName}
                onChange={(e) => onEditNameChange(e.target.value)}
                placeholder="Enter role name"
                required
              />
            </div>

            <div className="space-y-1.5">
              <label
                htmlFor="edit-role-description"
                className="text-sm font-medium text-slate-700"
              >
                Description
              </label>
              <Input
                id="edit-role-description"
                value={editDescription}
                onChange={(e) => onEditDescriptionChange(e.target.value)}
                placeholder="Description"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <p className="text-sm font-medium text-slate-700">Permissions *</p>
            {permissionsLoading ? (
              <p className="text-sm text-muted-foreground">
                Loading permissions...
              </p>
            ) : shownPermissionCount === 0 && !hasPermissionGroups ? (
              <p className="text-sm text-muted-foreground">
                No permissions available
              </p>
            ) : (
              <div className="rounded-xl border bg-slate-50/60 p-3">
                <div className="mb-3 flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2 text-sm text-slate-600">
                    <span className="rounded-md bg-emerald-100 px-2 py-1 text-emerald-700">
                      Selected:{selectedPermissionIds.length}
                    </span>
                    <span>{shownPermissionCount} shown</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={onSelectShownPermissions}
                      disabled={shownPermissionCount === 0}
                    >
                      Select Shown
                    </Button>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={onClearAllPermissions}
                      disabled={selectedPermissionIds.length === 0}
                    >
                      clear
                    </Button>
                  </div>
                </div>

                <div className="relative mb-3">
                  <Search className="absolute left-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                  <Input
                    value={permissionSearch}
                    onChange={(e) => onPermissionSearchChange(e.target.value)}
                    placeholder="Search permission name, resource, action..."
                    className="pl-8"
                  />
                </div>

                <div className="max-h-64 space-y-3 overflow-y-auto rounded-md border bg-white p-2">
                  {filteredPermissionGroups.map(([resource, permissions]) => {
                    const allSelected =
                      permissions.length > 0 &&
                      permissions.every((permission) =>
                        selectedPermissionIds.includes(permission._id),
                      );

                    return (
                      <div
                        key={resource}
                        className="rounded-md border border-slate-200 p-2"
                      >
                        <div className="mb-2 flex items-center justify-between rounded-md bg-slate-100 px-3 py-1.5">
                          <p className="text-xs font-semibold uppercase tracking-wide text-slate-700">
                            {resource}
                          </p>
                          <button
                            type="button"
                            onClick={() =>
                              onToggleGroupPermissions(
                                permissions,
                                !allSelected,
                              )
                            }
                            className="text-xs font-medium text-slate-700 hover:underline"
                          >
                            {allSelected ? "Clear Group" : "Select Group"}
                          </button>
                        </div>

                        <div className="grid grid-cols-1 gap-2 md:grid-cols-2">
                          {permissions.map((permission) => {
                            const checked = selectedPermissionIds.includes(
                              permission._id,
                            );

                            return (
                              <div
                                key={permission._id}
                                className="flex items-start gap-2 rounded-md p-2"
                              >
                                <button
                                  type="button"
                                  role="switch"
                                  aria-checked={checked}
                                  onClick={() =>
                                    onTogglePermission(permission._id)
                                  }
                                  className={`mt-0.5 h-5 w-9 rounded-full transition ${
                                    checked ? "bg-emerald-500" : "bg-slate-300"
                                  }`}
                                >
                                  <span
                                    className={`block h-4 w-4 rounded-full bg-white transition ${
                                      checked
                                        ? "translate-x-4"
                                        : "translate-x-0.5"
                                    }`}
                                  />
                                </button>
                                <div>
                                  <p className="text-sm font-semibold text-slate-700">
                                    {permission.name}
                                  </p>
                                  <p className="text-xs text-slate-500">
                                    {getPermissionHint(permission)}
                                  </p>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
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
            <Button type="submit" disabled={isPending || permissionsLoading}>
              {isPending ? "Updating..." : "Update"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
