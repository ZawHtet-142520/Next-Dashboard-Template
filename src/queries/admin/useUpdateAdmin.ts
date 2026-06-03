import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateAdmin } from "@/services/adminService";
import { UpdateAdminPayload } from "@/types/admin";

interface UpdateAdminMutationInput {
  adminId: string;
  payload: UpdateAdminPayload;
}

export const useUpdateAdmin = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ adminId, payload }: UpdateAdminMutationInput) =>
      updateAdmin(adminId, payload),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["admins"] });
      await queryClient.invalidateQueries({ queryKey: ["admin"] });
    },
  });
};
