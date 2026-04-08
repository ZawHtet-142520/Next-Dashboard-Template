import { updateNotificationTemplate } from "@/services/notificationTemplateService";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export const useUpdateNotificationTemplate = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: updateNotificationTemplate,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["templates"] });
    },
  });
};
