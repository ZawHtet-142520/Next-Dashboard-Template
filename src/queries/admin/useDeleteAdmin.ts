import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteAdmin } from "@/services/adminService";

export const useDeleteAdmin = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteAdmin,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["admins"] });
    },
  });
};
