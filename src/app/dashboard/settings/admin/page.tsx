"use client";

import { useRouter } from "next/navigation";
import { AdminHeader } from "@/components/admin/AdminHeader";
import { AdminsTable } from "@/components/admin/AdminsTable";
import { DeleteAdminConfirmModal } from "@/components/admin/DeleteAdminConfirmModal";
import { useAdminManagement } from "@/hooks/admin/useAdminManagement";

export default function AdminPage() {
  const router = useRouter();
  const admin = useAdminManagement();

  const handleCreateClick = () => {
    router.push("/dashboard/settings/admin/create");
  };

  const handleEditClick = (adminId: string) => {
    router.push(`/dashboard/settings/admin/edit/${adminId}`);
  };

  return (
    <div className="space-y-4">
      <AdminHeader
        onOpenCreate={handleCreateClick}
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
        onEdit={handleEditClick}
        onDelete={admin.openDeleteConfirm}
        onPageSizeChange={admin.onPageSizeChange}
        onPageChange={admin.setPage}
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
