import { getAdminById } from "@/services/adminService";
import { useQuery } from "@tanstack/react-query";

export const useAdminById = (adminId: string | null | undefined) => {
  return useQuery({
    queryKey: ["admin", adminId],
    queryFn: () => getAdminById(adminId as string),
    enabled: Boolean(adminId),
    staleTime: 60 * 1000,
    retry: 1,
  });
};
