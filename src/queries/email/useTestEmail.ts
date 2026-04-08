import { testEmail } from "@/services/emailService";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export const useTestEmail = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: testEmail,
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["email"] });
    },
  });
};
