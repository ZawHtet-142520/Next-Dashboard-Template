"use client";

import { useRouter } from "next/navigation";
import { RoleHeader } from "@/components/role/RoleHeader";
import { RolesTable } from "@/components/role/RolesTable";
import { DeleteRoleConfirmModal } from "@/components/role/DeleteRoleConfirmModal";
import { useRoleManagement } from "@/hooks/role/useRoleManagement";

export default function RolePage() {
  const router = useRouter();
  const role = useRoleManagement();

  const handleCreateClick = () => {
    router.push("/dashboard/settings/role/create");
  };

  const handleEditClick = (roleId: string) => {
    router.push(`/dashboard/settings/role/edit/${roleId}`);
  };

  return (
    <div className="space-y-4">
      <RoleHeader
        rolesLoading={role.rolesLoading}
        onOpenCreate={handleCreateClick}
        onRefresh={role.refreshRoles}
      />

      <RolesTable
        roles={role.roles}
        rolesLoading={role.rolesLoading}
        deletingId={role.deletingId}
        onEdit={handleEditClick}
        onDelete={(selectedRole) =>
          role.openDeleteConfirm(selectedRole._id, selectedRole.name)
        }
      />

      <DeleteRoleConfirmModal
        open={Boolean(role.pendingDeleteRole)}
        roleName={role.pendingDeleteRole?.name || "this role"}
        isPending={Boolean(role.deletingId)}
        onClose={role.closeDeleteConfirm}
        onConfirm={role.confirmDeleteRole}
      />
    </div>
  );
}
