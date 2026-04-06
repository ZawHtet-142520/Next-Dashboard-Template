import { updateEmailSetting } from "@/services/emailService";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export const useUpdateEmail = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: updateEmailSetting,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["email"] });
    },
  });
};
