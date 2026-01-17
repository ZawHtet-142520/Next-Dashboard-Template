import { useQuery } from "@tanstack/react-query";
import { fetchUserProfile } from "@/services/userService";

/**
 * Hook to fetch user profile data using React Query
 * 
 * Features:
 * - Automatic caching with 5-minute stale time
 * - Background refetching when window refocuses
 * - Automatic retry on failure
 * 
 * @example
 * const { data, isLoading, error } = useUserProfile();
 */
export const useUserProfile = () => {
  return useQuery({
    queryKey: ["userProfile"],
    queryFn: fetchUserProfile,
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: 2,
  });
};
