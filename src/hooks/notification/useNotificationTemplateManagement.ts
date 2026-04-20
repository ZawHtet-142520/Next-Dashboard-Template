import { useNotificationTemplate } from "@/queries/notification/useNotificationTemplate";
import { useUpdateNotificationTemplate } from "@/queries/notification/useUpdateNotificationTemplate";
import {
  updateNotificationTemplateSchema,
  UpdateNotificationTemplateType,
} from "@/schemas/updateNotificationTemplateSchema";
import { NotificationTemplateItem } from "@/types/template";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";

export function useNotificationTemplateManagement() {
  const { data: templatesResponse, isLoading: templatesResponseLoading } =
    useNotificationTemplate();
  const router = useRouter();
  const templates = templatesResponse?.data?.notificationTemplates || [];
  const [updating, setUpdating] = useState<boolean>(false);

  const updateTemplateForm = useForm<UpdateNotificationTemplateType>({
    defaultValues: {
      subject: "",
      template: "",
    },
    resolver: zodResolver(updateNotificationTemplateSchema),
  });

  const onEdit = (template: NotificationTemplateItem) => {
    router.push(`/dashboard/settings/notification/edit/${template._id}`);
  };

  const closeEdit = () => {
    router.push("/dashboard/settings/notification");
  };

  const updateNotificationTemplateMutation = useUpdateNotificationTemplate();

  const updateNotificationTemplate = async (
    data: UpdateNotificationTemplateType,
  ) => {
    setUpdating(true);
    try {
      const response =
        await updateNotificationTemplateMutation.mutateAsync(data);
      toast.success(
        response?.message || "Notification template updated successfully",
      );
      updateTemplateForm.reset(data);
      closeEdit();
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
    updateTemplateForm,
    updateNotificationTemplate,
    updating,
    closeEdit,
  };
}
