"use client";

import { useMemo, useState } from "react";
import toast from "react-hot-toast";
import {
  useCreateRole,
  useDeleteRole,
  usePermissionNames,
  useRoles,
  useUpdateRole,
} from "@/queries";
import { PermissionName, Role } from "@/types/role";

const actionOrder: Record<string, number> = {
  create: 1,
  read: 2,
  update: 3,
  delete: 4,
};

export function useRoleManagement() {
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [pendingDeleteRole, setPendingDeleteRole] = useState<{
    id: string;
    name: string;
  } | null>(null);
  const [openCreateModal, setOpenCreateModal] = useState(false);
  const [openEditModal, setOpenEditModal] = useState(false);
  const [permissionSearch, setPermissionSearch] = useState("");

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [editRoleId, setEditRoleId] = useState("");
  const [editName, setEditName] = useState("");
  const [editDescription, setEditDescription] = useState("");
  const [selectedPermissionIds, setSelectedPermissionIds] = useState<string[]>(
    [],
  );

  const {
    data: rolesResponse,
    isLoading: rolesLoading,
    refetch: refetchRoles,
  } = useRoles();
  const {
    data: permissionNamesResponse,
    isFetching: permissionsLoading,
    refetch: refetchPermissions,
  } = usePermissionNames(false);
  const createRoleMutation = useCreateRole();
  const updateRoleMutation = useUpdateRole();
  const deleteRoleMutation = useDeleteRole();

  const roles = rolesResponse?.data?.roles ?? [];
  const permissionGroups = useMemo(
    () => permissionNamesResponse?.data ?? {},
    [permissionNamesResponse?.data],
  );

  const filteredPermissionGroups = useMemo(() => {
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

  const onCreateRole = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!name.trim()) {
      toast.error("Role name is required");
      return;
    }

    try {
      const createResponse = await createRoleMutation.mutateAsync({
        name: name.trim(),
        description: description.trim(),
      });

      await refetchRoles();

      setName("");
      setDescription("");
      setOpenCreateModal(false);
      toast.success(createResponse?.message || "Role created successfully");
    } catch (error) {
      console.error("Failed to create role:", error);
      toast.error("Unable to create role");
    }
  };

  const openDeleteConfirm = (roleId: string, roleName: string) => {
    setPendingDeleteRole({ id: roleId, name: roleName });
  };

  const closeDeleteConfirm = () => {
    if (deletingId) {
      return;
    }

    setPendingDeleteRole(null);
  };

  const confirmDeleteRole = async () => {
    if (!pendingDeleteRole) {
      return;
    }

    const { id: roleId } = pendingDeleteRole;

    setDeletingId(roleId);
    try {
      const response = await deleteRoleMutation.mutateAsync(roleId);
      await refetchRoles();
      toast.success(response?.message || "Role deleted successfully");
    } catch (error) {
      console.error("Failed to delete role:", error);
      toast.error("Unable to delete role");
    } finally {
      setDeletingId(null);
      setPendingDeleteRole(null);
    }
  };

  const togglePermission = (permissionId: string) => {
    setSelectedPermissionIds((prev) =>
      prev.includes(permissionId)
        ? prev.filter((id) => id !== permissionId)
        : [...prev, permissionId],
    );
  };

  const openEditModalForRole = async (role: Role) => {
    setEditRoleId(role._id);
    setEditName(role.name);
    setEditDescription(role.description || "");
    setSelectedPermissionIds(
      role.permissions?.map((permission) => permission._id) || [],
    );

    if (Object.keys(permissionGroups).length === 0) {
      await refetchPermissions();
    }

    setOpenEditModal(true);
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

  const onUpdateRole = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!editRoleId) {
      toast.error("Invalid role id");
      return;
    }

    if (!editName.trim()) {
      toast.error("Role name is required");
      return;
    }

    try {
      const updateResponse = await updateRoleMutation.mutateAsync({
        roleId: editRoleId,
        payload: {
          name: editName.trim(),
          description: editDescription.trim(),
          permissions: selectedPermissionIds,
        },
      });

      await refetchRoles();
      setOpenEditModal(false);
      toast.success(updateResponse?.message || "Role updated successfully");
    } catch (error) {
      console.error("Failed to update role:", error);
      toast.error("Unable to update role");
    }
  };

  return {
    roles,
    rolesLoading,
    permissionsLoading,
    deletingId,
    pendingDeleteRole,
    openCreateModal,
    openEditModal,
    permissionSearch,
    name,
    description,
    editName,
    editDescription,
    selectedPermissionIds,
    filteredPermissionGroups,
    shownPermissionCount,
    hasPermissionGroups: Object.keys(permissionGroups).length > 0,
    isCreating: createRoleMutation.isPending,
    isUpdating: updateRoleMutation.isPending,
    openCreateRoleModal: () => setOpenCreateModal(true),
    closeCreateRoleModal: () => setOpenCreateModal(false),
    closeEditRoleModal: () => setOpenEditModal(false),
    openDeleteConfirm,
    closeDeleteConfirm,
    confirmDeleteRole,
    refreshRoles: () => {
      refetchRoles();
    },
    setName,
    setDescription,
    setEditName,
    setEditDescription,
    setPermissionSearch,
    onCreateRole,
    openEditModalForRole,
    togglePermission,
    toggleGroupPermissions,
    selectShownPermissions,
    clearAllPermissions,
    getPermissionHint,
    onUpdateRole,
  };
}
