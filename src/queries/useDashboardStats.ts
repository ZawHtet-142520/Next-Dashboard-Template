import { useQuery } from "@tanstack/react-query";
import { fetchDashboardStats } from "@/services/dashboardService";

/**
 * Hook to fetch dashboard statistics using React Query
 * 
 * Features:
 * - Automatic caching with 2-minute stale time
 * - Background refetching when window refocuses
 * - Automatic refetch every 5 minutes
 * - Automatic retry on failure
 * 
 * @example
 * const { data, isLoading, error, refetch } = useDashboardStats();
 */
export const useDashboardStats = () => {
  return useQuery({
    queryKey: ["dashboardStats"],
    queryFn: fetchDashboardStats,
    staleTime: 2 * 60 * 1000, // 2 minutes
    refetchInterval: 5 * 60 * 1000, // Refetch every 5 minutes
    retry: 2,
  });
};
