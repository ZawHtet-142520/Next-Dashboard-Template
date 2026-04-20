import { CreateWebsiteType } from "@/schemas/createWebsiteSchema";
import { updateWebsite } from "@/services/websiteService";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export const useUpdateWebsite = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      websiteId,
      payload,
    }: {
      websiteId: string;
      payload: CreateWebsiteType;
    }) => updateWebsite(websiteId, payload),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["websites"] });
    },
  });
};
