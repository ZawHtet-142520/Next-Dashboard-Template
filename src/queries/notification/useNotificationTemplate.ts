import { getAllNotificationTemplates } from "@/services/notificationTemplateService";
import { useQuery } from "@tanstack/react-query";

export const useNotificateTemplate = () => {
  return useQuery({
    queryKey: ["templates"],
    queryFn: getAllNotificationTemplates,
    staleTime: 60 * 1000,
    retry: 1,
  });
};
