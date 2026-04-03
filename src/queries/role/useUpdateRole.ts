import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateRole } from "@/services/roleService";
import { UpdateRolePayload } from "@/types/role";

interface UpdateRoleMutationInput {
  roleId: string;
  payload: UpdateRolePayload;
}

export const useUpdateRole = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ roleId, payload }: UpdateRoleMutationInput) =>
      updateRole(roleId, payload),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["roles"] });
    },
  });
};
