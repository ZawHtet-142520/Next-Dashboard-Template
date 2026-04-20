import { UpdateWebsiteEmailSettingType } from "@/schemas/updateWebsiteEmailSettingSchema";
import { updateWebsiteEmailSetting } from "@/services/websiteService";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export const useUpdateWebsiteEmailSetting = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      websiteId,
      payload,
    }: {
      websiteId: string;
      payload: UpdateWebsiteEmailSettingType;
    }) => updateWebsiteEmailSetting(websiteId, payload),
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: ["websites"],
      });
    },
  });
};
