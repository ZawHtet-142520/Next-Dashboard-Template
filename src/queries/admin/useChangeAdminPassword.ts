import { changeAdminPassword } from "@/services/adminService";
import { useMutation } from "@tanstack/react-query";

export const useChangeAdminPassword = () => {
  return useMutation({
    mutationFn: changeAdminPassword,
  });
};
