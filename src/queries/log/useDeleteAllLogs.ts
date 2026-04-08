import { deleteAllLogs } from "@/services/logService";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export const useDeleteAllLogs = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteAllLogs,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["logs"] });
    },
  });
};
