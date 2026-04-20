import { createWebsite } from "@/services/websiteService";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export const useCreateWebsite = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createWebsite,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["websites"] });
    },
  });
};
