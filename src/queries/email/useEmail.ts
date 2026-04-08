import { getEmailSetting } from "@/services/emailService";
import { useQuery } from "@tanstack/react-query";

export const useEmail = () => {
  return useQuery({
    queryKey: ["email"],
    queryFn: getEmailSetting,
    staleTime: 60 * 1000,
    retry: 1,
  });
};
