import { useQuery } from "@tanstack/react-query";
import { getPermissionNames } from "@/services/roleService";

export const usePermissionNames = (enabled = false) => {
  return useQuery({
    queryKey: ["permissionNames"],
    queryFn: getPermissionNames,
    enabled,
    staleTime: 5 * 60 * 1000,
    retry: 1,
  });
};
