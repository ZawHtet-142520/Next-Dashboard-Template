import { getLogs } from "@/services/logService";
import { GetLogsParams } from "@/types/log";
import { useQuery } from "@tanstack/react-query";

export const useLogs = (params: GetLogsParams) => {
  return useQuery({
    queryKey: ["logs", params],
    queryFn: () => getLogs(params),
    staleTime: 60 * 1000,
    retry: 1,
  });
};
