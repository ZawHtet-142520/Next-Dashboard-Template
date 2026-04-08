import { hasChanges } from "@/lib/changedFields";
import { useNotificateTemplate } from "@/queries/notification/useNotificationTemplate";
import { useUpdateNotificationTemplate } from "@/queries/notification/useUpdateNotificationTemplate";
import {
  updateNotificationTemplateSchema,
  UpdateNotificationTemplateType,
} from "@/schemas/updateNotificationTemplateSchema";
import { NotificationTemplateItem } from "@/types/template";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";

export function useNotificationTemplateManagement() {
  const { data: templatesResponse, isLoading: templatesResponseLoading } =
    useNotificateTemplate();
  const templates = templatesResponse?.data?.notificationTemplates || [];
  const [openEditModal, setOpenEditModal] = useState<boolean>(false);
  const [updating, setUpdating] = useState<boolean>(false);
  const [oldFields, setOldFields] = useState<UpdateNotificationTemplateType>({
    _id: "",
    subject: "",
    template: "",
    variables: [],
  });

  const closeEditModal = () => {
    if (updating) return;
    setOpenEditModal(false);
  };

  const updateTemplateForm = useForm<UpdateNotificationTemplateType>({
    defaultValues: {
      subject: "",
      template: "",
    },
    resolver: zodResolver(updateNotificationTemplateSchema),
  });

  const onEdit = (template: NotificationTemplateItem) => {
    updateTemplateForm.reset(template);
    setOldFields(updateTemplateForm.getValues());
    setOpenEditModal(true);
  };

  const updateNotificationTemplateMutation = useUpdateNotificationTemplate();

  const updateNotificationTemplate = async (
    data: UpdateNotificationTemplateType,
  ) => {
    const oldFieldsData = {
      subject: oldFields.subject,
      template: oldFields.template,
    };
    const newFieldsData = {
      subject: data.subject,
      template: data.template,
    };
    if (!hasChanges(oldFieldsData, newFieldsData)) {
      return toast.success("No changes");
    }
    setUpdating(true);
    try {
      const response =
        await updateNotificationTemplateMutation.mutateAsync(data);
      toast.success(
        response?.message || "Notification template updated successfully",
      );
      updateTemplateForm.reset(data);
      setOldFields(data);
    } catch (error) {
      console.error("Failed to update notification template:", error);
      toast.error("Unable to update notification template");
    } finally {
      setUpdating(false);
    }
  };

  return {
    templates,
    templatesResponseLoading,
    onEdit,
    openEditModal,
    closeEditModal,
    updateTemplateForm,
    updateNotificationTemplate,
    updating,
  };
}
