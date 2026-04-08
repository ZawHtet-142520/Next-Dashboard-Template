import { useQuery } from "@tanstack/react-query";
import { getAdmins } from "@/services/adminService";
import { GetAdminsParams } from "@/types/admin";

export const useAdmins = (params: GetAdminsParams) => {
  return useQuery({
    queryKey: ["admins", params],
    queryFn: () => getAdmins(params),
    staleTime: 60 * 1000,
    retry: 1,
  });
};
