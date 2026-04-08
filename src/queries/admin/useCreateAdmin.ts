import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createAdmin } from "@/services/adminService";

export const useCreateAdmin = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createAdmin,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["admins"] });
    },
  });
};
