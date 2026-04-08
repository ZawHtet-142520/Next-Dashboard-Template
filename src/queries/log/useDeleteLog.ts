import { deleteLog } from "@/services/logService";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export const useDeleteLog = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteLog,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["logs"] });
    },
  });
};
