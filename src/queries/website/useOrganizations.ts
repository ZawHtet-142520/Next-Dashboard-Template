import { getOrganizationList } from "@/services/organizationService";
import { useQuery } from "@tanstack/react-query";

export const useOrganizations = () => {
  return useQuery({
    queryKey: ["organizations"],
    queryFn: getOrganizationList,
    staleTime: 60 * 1000,
    retry: 1,
  });
};
