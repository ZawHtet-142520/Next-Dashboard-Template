"use client";

import { useState } from "react";
import toast from "react-hot-toast";
import {
  useDeleteRole,
  useRoles,
} from "@/queries";

export function useRoleManagement() {
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [pendingDeleteRole, setPendingDeleteRole] = useState<{
    id: string;
    name: string;
  } | null>(null);

  const {
    data: rolesResponse,
    isLoading: rolesLoading,
    refetch: refetchRoles,
  } = useRoles();
  const deleteRoleMutation = useDeleteRole();

  const roles = rolesResponse?.data?.roles ?? [];

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

  return {
    roles,
    rolesLoading,
    deletingId,
    pendingDeleteRole,
    openDeleteConfirm,
    closeDeleteConfirm,
    confirmDeleteRole,
    refreshRoles: () => {
      refetchRoles();
    },
  };
}
