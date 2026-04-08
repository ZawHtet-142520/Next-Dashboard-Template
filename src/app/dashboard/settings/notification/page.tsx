"use client";

import { EditNotificationTemplateModal } from "@/components/notification/EditNotificationTemplateModal";
import { NotificationTemplateHeader } from "@/components/notification/NotificationTemplateHeader";
import { NotificationTemplatesTable } from "@/components/notification/NotificationTemplateTable";
import { useNotificationTemplateManagement } from "@/hooks/notification/useNotificationTemplateManagement";

export default function NotificationTemplatePage() {
  const notificationTemplate = useNotificationTemplateManagement();
  return (
    <div className="space-y-4">
      <NotificationTemplateHeader />
      <NotificationTemplatesTable
        templates={notificationTemplate.templates}
        templatesResponseLoading={notificationTemplate.templatesResponseLoading}
        onEdit={notificationTemplate.onEdit}
      />
      <EditNotificationTemplateModal
        open={notificationTemplate.openEditModal}
        isPending={notificationTemplate.updating}
        updateNotificationForm={notificationTemplate.updateTemplateForm}
        onClose={notificationTemplate.closeEditModal}
        updateNotificationTemplate={
          notificationTemplate.updateNotificationTemplate
        }
      />
    </div>
  );
}
