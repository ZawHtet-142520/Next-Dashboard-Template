import { deleteWebsite } from "@/services/websiteService";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export const useDeleteWebsite = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteWebsite,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["websites"] });
    },
  });
};
