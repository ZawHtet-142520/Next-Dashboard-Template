"use client";

import { RoleHeader } from "@/components/role/RoleHeader";
import { RolesTable } from "@/components/role/RolesTable";
import { CreateRoleModal } from "@/components/role/CreateRoleModal";
import { EditRoleModal } from "@/components/role/EditRoleModal";
import { DeleteRoleConfirmModal } from "@/components/role/DeleteRoleConfirmModal";
import { useRoleManagement } from "@/hooks/role/useRoleManagement";

export default function RolePage() {
  const role = useRoleManagement();

  return (
    <div className="space-y-4">
      <RoleHeader
        rolesLoading={role.rolesLoading}
        onOpenCreate={role.openCreateRoleModal}
        onRefresh={role.refreshRoles}
      />

      <RolesTable
        roles={role.roles}
        rolesLoading={role.rolesLoading}
        deletingId={role.deletingId}
        onEdit={role.openEditModalForRole}
        onDelete={(selectedRole) =>
          role.openDeleteConfirm(selectedRole._id, selectedRole.name)
        }
      />

      <CreateRoleModal
        open={role.openCreateModal}
        name={role.name}
        description={role.description}
        isPending={role.isCreating}
        onNameChange={role.setName}
        onDescriptionChange={role.setDescription}
        onClose={role.closeCreateRoleModal}
        onSubmit={role.onCreateRole}
      />

      <EditRoleModal
        open={role.openEditModal}
        editName={role.editName}
        editDescription={role.editDescription}
        selectedPermissionIds={role.selectedPermissionIds}
        permissionSearch={role.permissionSearch}
        filteredPermissionGroups={role.filteredPermissionGroups}
        shownPermissionCount={role.shownPermissionCount}
        permissionsLoading={role.permissionsLoading}
        hasPermissionGroups={role.hasPermissionGroups}
        isPending={role.isUpdating}
        onEditNameChange={role.setEditName}
        onEditDescriptionChange={role.setEditDescription}
        onPermissionSearchChange={role.setPermissionSearch}
        onTogglePermission={role.togglePermission}
        onToggleGroupPermissions={role.toggleGroupPermissions}
        onSelectShownPermissions={role.selectShownPermissions}
        onClearAllPermissions={role.clearAllPermissions}
        onClose={role.closeEditRoleModal}
        onSubmit={role.onUpdateRole}
        getPermissionHint={role.getPermissionHint}
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
