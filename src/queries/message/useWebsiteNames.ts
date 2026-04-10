import { getWebsiteNames } from "@/services/messageService";
import { useQuery } from "@tanstack/react-query";

export const useWebsiteNames = () => {
  return useQuery({
    queryKey: ["website-names"],
    queryFn: getWebsiteNames,
    staleTime: 5 * 60 * 1000,
    retry: 1,
  });
};
