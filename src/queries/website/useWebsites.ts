import { getWebsiteList } from "@/services/websiteService";
import { GetWebisteParams } from "@/types/website";
import { useQuery } from "@tanstack/react-query";

export const useWebsites = (params: GetWebisteParams) => {
  return useQuery({
    queryKey: ["websites", params],
    queryFn: () => getWebsiteList(params),
    staleTime: 60 * 1000,
    retry: 1,
  });
};
