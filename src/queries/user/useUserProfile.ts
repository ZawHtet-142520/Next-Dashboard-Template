import { useQuery } from "@tanstack/react-query";
import { fetchUserProfile } from "@/services/userService";

export const useUserProfile = () => {
  return useQuery({
    queryKey: ["userProfile"],
    queryFn: fetchUserProfile,
    staleTime: 5 * 60 * 1000,
    retry: 2,
  });
};
