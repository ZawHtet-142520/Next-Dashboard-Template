import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createRole } from "@/services/roleService";

export const useCreateRole = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createRole,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["roles"] });
    },
  });
};
