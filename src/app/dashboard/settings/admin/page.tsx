"use client";

import { AdminHeader } from "@/components/admin/AdminHeader";
import { AdminsTable } from "@/components/admin/AdminsTable";
import { CreateAdminModal } from "@/components/admin/CreateAdminModal";
import { EditAdminModal } from "@/components/admin/EditAdminModal";
import { DeleteAdminConfirmModal } from "@/components/admin/DeleteAdminConfirmModal";
import { useAdminManagement } from "@/hooks/admin/useAdminManagement";

export default function AdminPage() {
  const admin = useAdminManagement();

  return (
    <div className="space-y-4">
      <AdminHeader
        onOpenCreate={admin.openCreateAdminModal}
        onClearFilters={admin.clearFilters}
        search={admin.search}
        statusFilter={admin.statusFilter}
        roleFilter={admin.roleFilter}
        roleOptions={admin.roleOptions}
        onSearchChange={admin.onSearchChange}
        onStatusFilterChange={admin.onStatusFilterChange}
        onRoleFilterChange={admin.onRoleFilterChange}
      />

      <AdminsTable
        admins={admin.admins}
        adminsLoading={admin.adminsLoading}
        pagination={admin.pagination}
        page={admin.page}
        pageSize={admin.limit}
        deletingId={admin.deletingId}
        onEdit={admin.openEditModalForAdmin}
        onDelete={admin.openDeleteConfirm}
        onPageSizeChange={admin.onPageSizeChange}
        onPageChange={admin.setPage}
      />

      <CreateAdminModal
        open={admin.openCreateModal}
        name={admin.name}
        email={admin.email}
        profilePreview={admin.profilePreview}
        password={admin.password}
        roleId={admin.roleId}
        roleOptions={admin.roleOptions}
        isPending={admin.isCreating}
        onNameChange={admin.setName}
        onEmailChange={admin.setEmail}
        onProfileFileChange={admin.onProfileFileChange}
        onPasswordChange={admin.setPassword}
        onRoleIdChange={admin.setRoleId}
        onClose={admin.closeCreateAdminModal}
        onSubmit={admin.onCreateAdmin}
      />

      <EditAdminModal
        open={admin.openEditModal}
        name={admin.editName}
        email={admin.editEmail}
        profilePreview={admin.editProfilePreview}
        password={admin.editPassword}
        roleId={admin.editRoleId}
        roleOptions={admin.roleOptions}
        isPending={admin.isUpdating}
        onNameChange={admin.setEditName}
        onEmailChange={admin.setEditEmail}
        onProfileFileChange={admin.onEditProfileFileChange}
        onPasswordChange={admin.setEditPassword}
        onRoleIdChange={admin.setEditRoleId}
        onClose={admin.closeEditAdminModal}
        onSubmit={admin.onUpdateAdmin}
      />

      <DeleteAdminConfirmModal
        open={Boolean(admin.pendingDeleteAdmin)}
        adminName={admin.pendingDeleteAdmin?.name || "this admin"}
        isPending={Boolean(admin.deletingId)}
        onClose={admin.closeDeleteConfirm}
        onConfirm={admin.confirmDeleteAdmin}
      />
    </div>
  );
}
