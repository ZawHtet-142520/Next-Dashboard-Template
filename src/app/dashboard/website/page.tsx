"use client";

import { ConfigureWebsiteEmailSettingModal } from "@/components/website/ConfigureWebsiteEmailSettingModal";
import { DeleteWebsiteConfirmModal } from "@/components/website/DeleteWebsiteModal";
import { EditWebsiteModal } from "@/components/website/EditWebsiteModal";
import { WebsiteHeader } from "@/components/website/WebsiteHeader";
import { WebsiteTable } from "@/components/website/WebsiteTable";
import { useWebsiteManagement } from "@/hooks/website/useWebsiteManagement";

export default function WebsitePage() {
  const website = useWebsiteManagement();
  return (
    <div className="space-y-4">
      <WebsiteHeader
        onOpenCreate={website.openCreateWebsite}
        onClearFilters={website.clearFilters}
        search={website.search}
        onSearchChange={website.onSearchChange}
        createdAfter={website.createdAfter}
        createdBefore={website.createdBefore}
        onCreatedAfterChange={website.onCreatedAfterChange}
        onCreatedBeforeChange={website.onCreatedBeforeChange}
      />
      <WebsiteTable
        websites={website.websites}
        webstieListLoading={website.websiteListLoading}
        pagination={website.pagination}
        page={website.page}
        pageSize={website.limit}
        deletingId={website.deletingId}
        onEdit={website.openEditWebsiteModal}
        onDelete={website.openDeleteConfirm}
        onConfigure={website.openConfigureWebsiteEmailSettingModal}
        onPageSizeChange={website.onPageSizeChange}
        onPageChange={website.setPage}
        toLogoPreviewUrl={website.toLogoPreviewUrl}
      />

      <EditWebsiteModal
        open={website.openEditModal}
        isPending={website.isEditing}
        onClose={website.closeEditWebsiteModal}
        onEditWebsite={website.onEditWebsite}
        editWebsiteForm={website.editWebsiteForm}
        logoPreview={website.editLogoPreview}
        onLogoFileChange={website.onEditLogoFileChange}
        organizationOptions={website.organizationOptions}
      />
      <DeleteWebsiteConfirmModal
        open={Boolean(website.pendingDeleteWebsite)}
        isPending={Boolean(website.deletingId)}
        onClose={website.closeDeleteConfirm}
        onConfirm={website.confirmDeleteAdmin}
      />
      <ConfigureWebsiteEmailSettingModal
        open={website.openConfigureModal}
        isPending={website.isConfiguring}
        onClose={website.closeConfigureModal}
        configureEmailSettingForm={website.configrueEmailSettingForm}
        onSubmit={website.onConfigureWebsiteEmailSetting}
      />
    </div>
  );
}
