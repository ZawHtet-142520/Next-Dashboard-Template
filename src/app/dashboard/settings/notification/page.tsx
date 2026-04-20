"use client";

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
    </div>
  );
}
