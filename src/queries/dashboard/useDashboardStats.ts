import { useQuery } from "@tanstack/react-query";
import { fetchDashboardStats } from "@/services/dashboardService";

export const useDashboardStats = () => {
  return useQuery({
    queryKey: ["dashboardStats"],
    queryFn: fetchDashboardStats,
    staleTime: 2 * 60 * 1000,
    refetchInterval: 5 * 60 * 1000,
    retry: 2,
  });
};
