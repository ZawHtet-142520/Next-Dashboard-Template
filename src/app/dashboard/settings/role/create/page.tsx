"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useCreateRole, usePermissionNames } from "@/queries";
import toast from "react-hot-toast";
import { PermissionName } from "@/types/role";

type PermissionGroupEntry = readonly [string, PermissionName[]];

const actionOrder: Record<string, number> = {
  create: 1,
  read: 2,
  update: 3,
  delete: 4,
};

export default function CreateRolePage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [selectedPermissionIds, setSelectedPermissionIds] = useState<string[]>([]);
  const [permissionSearch, setPermissionSearch] = useState("");

  const createRoleMutation = useCreateRole();
  const { data: permissionNamesResponse, isFetching: permissionsLoading } = usePermissionNames(true);

  const permissionGroups = useMemo(
    () => permissionNamesResponse?.data ?? {},
    [permissionNamesResponse?.data],
  );

  const filteredPermissionGroups: PermissionGroupEntry[] = useMemo(() => {
    const search = permissionSearch.trim().toLowerCase();

    const entries = Object.entries(permissionGroups).map(
      ([resource, permissions]) => {
        const sortedPermissions = [...permissions].sort((a, b) => {
          const left = actionOrder[a.action || ""] || 99;
          const right = actionOrder[b.action || ""] || 99;
          return left - right;
        });

        if (!search) {
          return [resource, sortedPermissions] as const;
        }

        const matchedPermissions = sortedPermissions.filter((permission) => {
          const haystack =
            `${permission.name} ${permission.resource || ""} ${permission.action || ""}`.toLowerCase();
          return haystack.includes(search);
        });

        return [resource, matchedPermissions] as const;
      },
    );

    return entries.filter(([, permissions]) => permissions.length > 0);
  }, [permissionGroups, permissionSearch]);

  const shownPermissionIds = useMemo(
    () =>
      filteredPermissionGroups.flatMap(([, permissions]) =>
        permissions.map((permission) => permission._id),
      ),
    [filteredPermissionGroups],
  );

  const shownPermissionCount = shownPermissionIds.length;

  const togglePermission = (permissionId: string) => {
    setSelectedPermissionIds((prev) =>
      prev.includes(permissionId)
        ? prev.filter((id) => id !== permissionId)
        : [...prev, permissionId],
    );
  };

  const toggleGroupPermissions = (
    permissions: PermissionName[],
    shouldSelect: boolean,
  ) => {
    const permissionIds = permissions.map((permission) => permission._id);
    setSelectedPermissionIds((prev) => {
      if (shouldSelect) {
        const merged = new Set([...prev, ...permissionIds]);
        return Array.from(merged);
      }

      return prev.filter((id) => !permissionIds.includes(id));
    });
  };

  const selectShownPermissions = () => {
    setSelectedPermissionIds((prev) =>
      Array.from(new Set([...prev, ...shownPermissionIds])),
    );
  };

  const clearAllPermissions = () => {
    setSelectedPermissionIds([]);
  };

  const getPermissionHint = (permission: PermissionName) => {
    const actionLabel =
      permission.action || permission.name.split(".").at(-1) || "";
    const resourceLabel =
      permission.resource || permission.name.split(".").at(0) || "";
    const actionMap: Record<string, string> = {
      create: "Create",
      read: "View",
      update: "Update",
      delete: "Delete",
    };

    const actionText = actionMap[actionLabel] || actionLabel;
    return `${actionText} ${resourceLabel}`;
  };

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!name.trim()) {
      toast.error("Role name is required");
      return;
    }

    createRoleMutation.mutate(
      { name, description, permissions: selectedPermissionIds },
      {
        onSuccess: () => {
          toast.success("Role created successfully");
          router.push("/dashboard/settings/role");
        },
        onError: (error: any) => {
          const message =
            error?.response?.data?.message || "Failed to create role";
          toast.error(message);
        },
      }
    );
  };

  return (
    <div className="min-h-screen bg-transparent p-4">
      <div className="mx-auto max-w-4xl space-y-6">
        {/* Header */}
        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            size="icon"
            onClick={() => router.back()}
            className="border-border bg-card text-foreground hover:bg-accent"
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-foreground">Create Role</h1>
            <p className="text-sm text-muted-foreground">
              Add a new role with name and description
            </p>
          </div>
        </div>

        {/* Form Card */}
        <div className="rounded-2xl border border-border bg-card p-8 shadow-lg shadow-slate-900/5">
        <form onSubmit={onSubmit} className="space-y-3">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div className="space-y-1.5">
              <label
                htmlFor="role-name"
                className="text-sm font-medium text-foreground"
              >
                Name *
              </label>
              <Input
                id="role-name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter role name"
                required
              />
            </div>

            <div className="space-y-1.5">
              <label
                htmlFor="role-description"
                className="text-sm font-medium text-foreground"
              >
                Description
              </label>
              <Input
                id="role-description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Description"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <p className="text-sm font-medium text-foreground">Permissions</p>
            {permissionsLoading ? (
              <p className="text-sm text-muted-foreground">
                Loading permissions...
              </p>
            ) : shownPermissionCount === 0 && filteredPermissionGroups.length === 0 && !permissionSearch ? (
              <p className="text-sm text-muted-foreground">
                No permissions available
              </p>
            ) : (
              <div className="rounded-xl border bg-muted/40 p-3">
                <div className="mb-3 flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
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
                      onClick={selectShownPermissions}
                      disabled={shownPermissionCount === 0}
                    >
                      Select Shown
                    </Button>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={clearAllPermissions}
                      disabled={selectedPermissionIds.length === 0}
                    >
                      clear
                    </Button>
                  </div>
                </div>

                <div className="relative mb-3">
                  <Search className="absolute left-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    value={permissionSearch}
                    onChange={(e) => setPermissionSearch(e.target.value)}
                    placeholder="Search permission name, resource, action..."
                    className="pl-8"
                  />
                </div>

                <div className="max-h-64 space-y-3 overflow-y-auto rounded-md border bg-background p-2">
                  {filteredPermissionGroups.map(([resource, permissions]) => {
                    const allSelected =
                      permissions.length > 0 &&
                      permissions.every((permission) =>
                        selectedPermissionIds.includes(permission._id),
                      );

                    return (
                      <div
                        key={resource}
                        className="rounded-md border border-border p-2"
                      >
                        <div className="mb-2 flex items-center justify-between rounded-md bg-muted/60 px-3 py-1.5">
                          <p className="text-xs font-semibold uppercase tracking-wide text-foreground">
                            {resource}
                          </p>
                          <button
                            type="button"
                            onClick={() =>
                              toggleGroupPermissions(
                                permissions,
                                !allSelected,
                              )
                            }
                            className="text-xs font-medium text-foreground hover:underline"
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
                                    togglePermission(permission._id)
                                  }
                                  className={`mt-0.5 h-5 w-9 rounded-full transition ${
                                    checked ? "bg-emerald-500" : "bg-muted"
                                  }`}
                                >
                                  <span
                                    className={`block h-4 w-4 rounded-full bg-background transition ${
                                      checked
                                        ? "translate-x-4"
                                        : "translate-x-0.5"
                                    }`}
                                  />
                                </button>
                                <div>
                                  <p className="text-sm font-semibold text-foreground">
                                    {permission.name}
                                  </p>
                                  <p className="text-xs text-muted-foreground">
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
              onClick={() => router.back()}
              disabled={createRoleMutation.isPending}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={createRoleMutation.isPending || permissionsLoading}>
              {createRoleMutation.isPending ? "Creating..." : "Create"}
            </Button>
          </div>
        </form>
        </div>
      </div>
    </div>
  );
}
