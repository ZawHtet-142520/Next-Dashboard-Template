import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteRole } from "@/services/roleService";

export const useDeleteRole = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteRole,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["roles"] });
    },
  });
};
